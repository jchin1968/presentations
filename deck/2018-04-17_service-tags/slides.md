name: cover
class: center, middle
# Drupal 8 Service Tags
### Joseph Chin<br>Singapore Drupal Meetup<br>April 17, 2018


---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
- Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/2018-04-17_service-tags/index.html

---
# Use Case
- Bicycle shop selling locally (SG) and overseas (MY, CA)
- Create an online store using Drupal 8
- Shipping is complicated. Timing, costs and instructions vary greatly depending on:
  - Distance and mode of transport
  - Taxes, customs and duty
  - Safety regulations i.e. reflectors, light kit  


---
# Online Ordering Workflow
1. Customer browse for bicycles online
1. Add bicycle to cart and checkout
1. Enter personal details and delivery address
1. .highlight[Calculate shipping cost and delivery schedule]
1. Submit payment information
1. Perform financial transaction
1. Receive order confirmation
 
   
---
# Calculate Shipping
### Using Switch-Case statements

```php
switch ( $delivery_address['country_code'] ) {
  case 'ca':
    $shipping = new ShippingCanada($packageSpecs);
    break;
  case 'my':
    $shipping = new ShippingMalaysia($packageSpecs);
    break;
  case 'sg':
    $shipping = new ShippingSingapore($packageSpecs);
    break;
}

$cost = $shipping->cost();
$schedule = $shipping->schedule();
$instructions = $shipping->instructions()

```


---
# Shipping Class Per Country 
.../bikeshop/src/Shipping/ShippingCanada.php
```php
namespace Drupal\bikeshop\Shipping;
use Drupal\bikeshop\ShippingInterface;

class ShippingCanada implements ShippingInterface {
  public function __construct($packageSpecs) {
    ...
  }
  
  public function cost() {
    ...
    return $cost;
  }
  
  public function schedule() {
    ...
    return $schedule;
  }
  
  public function instructions() {
    ...
    return $instructions;
  }
}
```

???
- Note the use of Interfaces. This forces each country class to implement certain methods.

---
# Shipping Interface
.../bikeshop/ShippingInterface.php

```php
namespace Drupal\bikeshop;

interface ShippingInterface {

  public function cost();

  public function schedule();
  
  public function instructions();

}
```

???
- include this slide for completeness


---
# Add New Country
```php
switch ( $delivery_address['country_code'] ) {
  case 'ca':
    ...
    ...
  case 'my':
    ...
    ...
  case 'sg':
    ...
    ...
  case 'uk':
    $shipping = new ShippingUK($packageSpecs);
    break;
}

```

???
Problems
- Need to update switch-case block and potentially in many places
- how would a custom module add new countries without altering the original module 

---
class: center, middle
# Service Tags
### Instead of Switch-Case Statements

---
# Modify Our Country Class
```php
class ShippingCanada implements ShippingInterface {
  public function __construct($packageSpecs) {
    ...
  }
  
  public function cost() {
    ...
    return $cost;
  }
  
  public function schedule() {
    ...
    return $schedule;
  }
  
  public function instructions() {
    ...
    return $instructions;
  }
  
* public function code() {
*   return 'ca';
* }
}
```

---
# Create Shipping Controller Class
.../bikeshop/src/ShippingController.php

```php
namespace Drupal\bikeshop;

class ShippingController {
  private $countries = [];

  public function addCountry(ShippingInterface $country) {
    $this->$countries[] = $country;
  }

  public function getCountry($country_code) {
    foreach ($this->$countries as $country) {
      if ($country->code() == $country_code) {
        return $country;
      }
    }
    return NULL;
  }
}

```

???
- used to manage different country classes
- addCountry method simply add each of our shipping country class to an array
- getCountry method will fetch a specific country class


---
name: services-yml
# Define Service Collector
.../bikeshop/bikeshop.services.yml
```yaml
services:
  shipping.countries:
    class: \Drupal\bikeshop\ShippingController
    tags:
      - { name: 'service_collector', tag: 'bikeshop_shipping', call: 'addCountry' }

  shipping.canada:
    class: \Drupal\bikeshop\Shipping\ShippingCanada
    tags:
      - { name: 'bikeshop_shipping' }
  shipping.malaysia:
    class: \Drupal\bikeshop\Shipping\ShippingMalaysia
    tags:
      - { name: 'bikeshop_shipping' }
  shipping.singapore:
    class: \Drupal\bikeshop\Shipping\ShippingSingapore
    tags:
      - { name: 'bikeshop_shipping' }
      
```      

???
- this is where the magic begins
- 


---
# Calculate Shipping - New and Improved

```php
// switch ($delivery_address['country_code']) {
//   case 'ca':
//   ...
//   ...
// }

$countries = \Drupal::service('shipping.countries');
$country = $countries->getCountry( $delivery_address['country_code'] );

$cost = $shipping->cost();
$schedule = $shipping->schedule();
$instructions = $shipping->instructions()
```

???
- only at this point, are our classes loaded into the system
- 

---
# New Use Case
- Partnership formed in Thailand
- Partner branded Drupal 8 site but re-use bikeshop module

---
# Create Thailand Country Class
.../.highlight[bangkok_cycle]/src/Shipping/ShippingThailand.php
```php
use Drupal/bikeshop/ShippingInterface;

class ShippingThailand implements ShippingInterface {
  ...
  ...
  ...
  
  public function instructions() {
    ...
    return $instructions;
  }
    
  public function code() {
    return 'th';
  }
}
```
 

---
# bikerus.service.yml
- 


---
# References
- https://www.drupal.org/docs/8/api/services-and-dependency-injection/service-tags
- https://damow.net/the-strategy-pattern-with-symfony/
- https://lakshminp.com/tagged-services-drupal-8
- https://knpuniversity.com/screencast/drupal8-under-the-hood/what-is-the-service-container
- https://cipix.nl/understanding-drupal-8-part-2-service-container

---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]