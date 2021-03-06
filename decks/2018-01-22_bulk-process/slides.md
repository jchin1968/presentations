name: cover
class: center, middle
# Bulk Processing in Drupal 8
### Joseph Chin<br>Singapore Drupal Meetup<br>January 22, 2018


---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
* jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
* Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/2018-01-22_bulk-process/index.html

---
# Our Scenario
- Commerce website with 100,000+ users
- Reward users by adding extra credit to their balance
- Information comes from a CSV file with the format: ***uid, credit_amount***

Example:
```CSV
    8435, 125
    1229, 175
    3273, 100
    7651, 135
    ...
```


---
# Method 1 - Basic Loop
```php
$file_handle = fopen('crm_export.csv', 'r');
$file_array = fgetcsv($file_handle, 1024);

foreach ($file_array as $row) {
  $user = \Drupal\user\Entity\User::load($row[0]);
  $current = $user->get('field_account_balance')->value;
  $user->set('field_account_balance', $current + $row[1]);
  $user->save();
}
```
- OK for small datasets
- Risk PHP timeout and out of memory errors

???
* grab all nodes and start processing
* Problems with this approach:
  * large number of rows can cause a PHP timeout or a memory leak
  * if the process is stopped midway, there can be data integrity issues since the process will need to restart from the beginning but there is already some data imported

---
# Method 2 - Batch API

```php
$file_handle = fopen('crm_export.csv', 'r');
$file_array = fgetcsv($file_handle, 1024);

$operations = [];
foreach ($file_array as $row) {
  $operations[] = ['mymodule_batch_balance_add', [$row]];
}

$batch = [
  'operations' => $operations,
  'finished' => 'mymodule_batch_finish',
];

batch_set($batch);
batch_process('redirect_path');  // Not needed if form submit
```

???
* create batch operations then process with batch api
* automatically creates new http requests so no danger of running out of memory or timing out
* but, if process is stopped midway, then need to restart and can result in corrupted or inconsistent data
* and you have to keep your browser window open while processing
* batch_process() is not needed in form submit handlers. Form API takes care of batches that were set during form submission

---
# Method 2 - Batch Process Callback
```php
function mymodule_batch_balance_add($row, &$context) {
  $user = \Drupal\user\Entity\User::load($row[0]);
  $current = $user->get('field_account_balance')->value;
  $user->set('field_account_balance', $current + $row[1];
  $user->save();

  $context['results']['total_users']++;
}
```

---
# Method 2 - Batch Finish Callback
```php
function mymodule_batch_finish($success, $results, $operations) {
  if ($success) {
    $message = t('Credits issued to %total users',
      ['%total' => $results['total_users']]
    )
  } else {
    $message = t('An error occured')
  }

  drupal_set_message($message);
}
```

???

---
name: batch-summary
# Method 2 - Batch Summary
- Drupal automatically create new HTTP processes to avoid PHP timeout and out of memory errors
- Live status during processing
.batch-process-img.middle[![image](batch_process.png)]
- If batch process is stopped midway, data can become inconsistent

---
# Method 3 - Queue API
```php
$file_handle = fopen('crm_export.csv', 'r');
$file_array = fgetcsv($file_handle, 1024);

$queue = \Drupal::queue('bulkprocess_queue');
$queue->createQueue();

foreach ($file_array as $row) {
  $queue->createItem($row);
}
```

???
* create queue items then process during cron runs
* similar to batch but you're at the mercy of when cron gets executed or you configure cron to run frequently which may or maybe be ok

---
# Method 3 - QueueWorker With Cron
.../src/Plugin/QueueWorker/BulkProcessQueue.php
```php
namespace Drupal\bulkprocess\Plugin\QueueWorker;
use Drupal\Core\Queue\QueueWorkerBase;

/**
 * @QueueWorker(
 *   id = "bulkprocess_queue",
 *   title = @Translation("Bulk Process queue"),
 *   cron = {"time" = 60}
 * )
 */
class BulkProcessQueue extends QueueWorkerBase {
  public function processItem($row) {
    $user = \Drupal\user\Entity\User::load($row[0]);
    $current = $user->get('field_account_balance')->value;
    $user->set('field_account_balance', $current + $row[1];
    $user->save();
  }
}
```
???
* QueueWorker replaces hook_cron_queue_info()

---
# Method 3 - Queue Summary
- Items processed individually to avoid PHP timeout and out of memory errors
- Queue is persistent. Unprocessed items are processed in the next cron run
- Background process, no immediate feedback and is subject to cron schedule


---
# Method 4 - Hybrid - Queuing
```php
$file_handle = fopen('crm_export.csv', 'r');
$file_array = fgetcsv($file_handle, 1024);

$queue = \Drupal::queue('bulkprocess_hybrid');
$queue->createQueue();

foreach ($file_array as $row) {
  $queue->createItem($row);
}
```

---
# Method 4 - Hybrid - Batching
```php
$queue = \Drupal::queue("bulkprocess_hybrid");

$operations = [];
while ($item = $queue->claimItem(7200)) {
  $operations[] = ['bulkprocess_hybrid_batch_process', [$item]];
}

$batch = array(
  'operations' => $operations,
  'finished' => 'bulkprocess_hybrid_batch_finish',
);

batch_set($batch);
batch_process('redirect_path');  // Not needed if form submit
```

---
# Method 4 - Hybrid - Batch Process Callback
```php
function bulkprocess_hybrid_batch_process($item, &$context) {
  try {
    $row = $item->data;

    $user = \Drupal\user\Entity\User::load($row[0]);
    $current = $user->get('field_account_balance')->value;
    $user->set('field_account_balance', $current + $row[1];
    $user->save();

    $context['results']['total_users'] += 1;

    $queue = \Drupal::queue("bulkprocess_hybrid");
    $queue->deleteItem($item);

  } catch (\Exception $e) {
    $queue->releaseItem($item);
  }
}
```

---
# Method 4 - Hybrid - Batch Finish Callback
```php
function mymodule_hybrid_batch_finish($success, $results, $operations) {
  if ($success) {
    $message = t('Credits issued to %total users',
      ['%total' => $results['total_users']]
    )
  } else {
    $message = t('An error occured')
  }

  drupal_set_message($message);
}
```

---
# Method 4 - Hybrid Summary
- Persistency issue resolved with queues
- Immediate feedback provided with batch
- And PHP timeout and out of memory errors are kept at bay


---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]


