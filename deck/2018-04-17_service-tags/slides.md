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
# What are Service Tags?
- *"Tags are used to indicate that a service should be registered or used in some special way, or that it belongs to a category."*
- Symfony feature implemented into Drupal 8  

---
# Background
- Bicycle shop selling locally (SG) and overseas (MY, CA)
- Create an online store using Drupal 8
- Shipping is complicated. Timing, costs and instructions vary greatly depending on:
  - Distance and mode of transport
  - Taxes, customs and duty
  - Safety regulations i.e. reflectors, light kit  


---
name: our-task
# Our Task
1. Browse catalog
1. Add to cart
1. Checkout
1. Enter personal details and delivery address
1. .highlight[Calculate shipping cost, delivery schedule and packing instructions]
1. Enter payment information
1. Process payment
1. Receive order confirmation
 

---
# Create Shipping Class Per Country 
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
# Calculate Shipping
### Using Switch-Case Block
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
.../bikeshop/src/Controller/ShippingController.php

```php
namespace Drupal\bikeshop\Controller;

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
    class: \Drupal\bikeshop\Controller\ShippingController
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
# Calculate Shipping
### Using Service Tags
```php
// switch ($delivery_address['country_code']) {
//   case 'ca':
//   ...
//   ...
// }

$controller = \Drupal::service('shipping.countries');
$shipping = $controller->getCountry( $delivery_address['country_code'] );

$cost = $shipping->cost();
$schedule = $shipping->schedule();
$instructions = $shipping->instructions()
```

???
- only at this point, are our classes loaded into the system


---
name: directory-structure
# Summarizing
### BikeShop Module Folder

```text
/bikeshop
|-- bikeshop.info.yml
|-- bikeshop.services.yml
|-- /src
|   |-- /Controller
|   |   |-- ShippingController.php  
|   |-- /Shipping
|   |   |-- ShippingCanada.php
|   |   |-- ShippingMalaysia.php
|   |   |-- ShippingSingapore.php
|   |-- ShippingInterface.php
```


---
# New Scenario
- Partnership formed in Thailand
- Partner branded Drupal 8 site but re-use bikeshop module

---
# Create Thailand Country Class
.../.highlight[bangkok_cycle]/src/Shipping/ShippingThailand.php
```php
use Drupal`\bikeshop`\ShippingInterface;

class ShippingThailand implements ShippingInterface {
  ...
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
# Create Service Definition 
.../bangkok_cycle/bangkok_cycle.service.yml
```yaml
services:
  shipping.thailand:
    class: \Drupal\bangkok_cycle\Shipping\ShippingThailand
    tags:
      - { name: 'bikeshop_shipping' }
``` 


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