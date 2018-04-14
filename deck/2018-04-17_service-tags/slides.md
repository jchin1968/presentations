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
- Bicycle shop selling locally and overseas
- Create an online store using Drupal 8
- Shipping is complicated. Timing, costs and instructions vary greatly depending on:
  - Distance and mode of transport
  - Taxes, customs and duty
  - Safety regulations i.e. light kit  

---
# Online Shopping Workflow
1. Customer browse for bicycles online
1. Add bicycle to cart and checkout
1. Enter personal details and delivery address
1. .highlight[Calculate shipping cost and delivery schedule]
1. Submit payment information
1. Receive Confirmation
 
   
---
# Calculate Shipping to Different Countries
### Method 1 - Switch-Case Block

```php
switch ($delivery_address['country_code']) {
  case 'sg':
    $shipping = new ShippingSingapore($packageSpecs);
    break;
  case 'my':
    $shipping = new ShippingMalaysia($packageSpecs);
    break;
  case 'ca':
    $shipping = new ShippingCanada($packageSpecs);
    break;
}

$cost = $shipping->cost();
$schedule = $shipping->schedule();
$instructions = $shipping->instructions()

```


---
# Create Shipping Class per Country 

.../bikeshop/src/Shipping/ShippingCanada.php
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
}
```

???
- Note the use of Interfaces. This forces each country class to implement certain methods.

---
# Shipping Interface
.../bikeshop/ShippingInterface.php

```php
interface ShippingInterface {

  public function cost();

  public function schedule();
  
  public function instructions();

}
```

???
- include this slide for competeness


---
# Adding a New Country
```php
switch ($delivery_address['country_code']) {
  ...
  ...
  ...
  ...
  ...
  ...
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
# Calculate Shipping to Different Countries
### Method 2 - Switch-Case Block
Modify the country class  

.../bikeshop/src/Shipping/ShippingCanada.php
```php
class ShippingCanada implements ShippingInterface {  
  public function calculate($packageSpecs) {
    ...
    return $shippingCost;
  }
  
  public function code() {
    return 'ca';
}
```

---
# ShippingCalculator
.../bikeshop/src/ShippingCalculator.php

```php
class ShippingCalculator {
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


---

# shipping.services.yml
Define Service Collectors

.../bikeshop/bikeshop.services.yml
```yaml
services:
  shipping.countries:
    class: \Drupal\bikeshop\ShippingCalculator
    tags:
      - { name: service_collector, tag: 'bikeshop_shipping', call: 'addCountry' }

  shipping.canada:
    class: \Drupal\bikeshop\Shipping\ShippingCanada
    tags:
      - { name: 'bikeshop_shipping' }
  shipping.japan:
    class: \Drupal\bikeshop\Shipping\ShippingJapan
    tags:
      - { name: 'bikeshop_shipping' }
  shipping.uk:
    class: \Drupal\bikeshop\Shipping\ShippingUk
    tags:
      - { name: 'bikeshop_shipping' }
      
```      

---
# Calculating the Cost

```php
    $countries = \Drupal::service('shipping.countries');
    $country = $countries->getCountry($country_code);
    $shipping_cost = $country->calculate());
```




---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]