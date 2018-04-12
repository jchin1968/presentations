name: cover
class: center, middle
# Drupal 8 Service Tags
### Joseph Chin<br>Singapore Drupal Meetup<br>April 17, 2018


---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
* jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
* Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/2018-04-17_service-tags/index.html


---
# Agenda


---
# Customizing Software
- hack core
- hooks
- service collectors

???
- In the old days when working with pre-made software, custom changes were made directly on the core source code
- When I started with drupal 6, they introduced me to the concept of hooks and I thought, man this is great!
- Now, with Drupal 8, we have service collectors


---
# What's wrong with hooks?
 -all functions are loaded initially which is slow and a waste of memory
- passing along giantic arrays and object elements makes them difficult to manipulate

???
- fine for the time when PHP was not object oriented friendly


---
# Our use case
- Manufacturer with shipments to various countries
- Shipping costs varies depending on the country due to different carriers, taxes, regulations, etc.

---
# Procedural Way
Switch-case statement calling functions

```php
switch ($country_code) {
  case 'ca':
    $shipping_cost = calculate_shipping_canada($package_specs);
    break;    
  case 'jp':
    $shipping_cost = calculate_shipping_japan($package_specs);
    break;
}

return $shipping_cost;

```

---
# Procedural Way
Create functions for each country

```php
function calculate_shipping_canada($package_specs) {
  $shipping_cost = ...
  return $shipping_cost;
}

function calculate_shipping_japan($package_specs) {
  $shipping_cost = ...
  return $shipping_cost;
}
```


---
# Object Oriented Way
Switch-case statement instantiating objects

```php
switch ($country_code) {
  case 'ca':
    $shipping = new ShippingCanada();
    break;
  case 'jp':
    $shipping = new ShippingJapan();
    break;
}

$shipping_cost = $rate->calculate($packageSpecs);

```

---
# Object Oriented Way

Create a class per country 

.../shipping/src/Shipping/ShippingCanada.php
```php
class ShippingCanada implements ShippingInterface {  
  public function calculate($packageSpecs) {
    ...
    return $shippingCost;
  }
}
```
.../shipping/src/Shipping/ShippingJapan.php
```php
class ShippingJapan implements ShippingInterface {  
  public function calculate($packageSpecs) {
    ...
    return $shippingCost;
  }
}
```

---
# Object Oriented Way

Create an interface to force country classes to implement certain methods

```php
interface ShippingInterface {

  public function calculate($packageSpecs);

  public function countryCode();
  
}
```


---
# ShippingRateCalculator
.../shipping/src/ShippingCalculator.php

```php
class ShippingCalculator {
  private $calculators = [];

  public function addRate(ShippingInterface $calculator) {
    $this->$calculators[] = $calculator;
  }

  public function process($country_code) {
    foreach ($this->$calculators as $calculator) {
      if ($calculator->countryCode() == $country_code) {
        return $calculator;
      }
    }
    return NULL;
  }
}

```


---

# shipping.services.yml
Define Service Collectors

.../shipping/shipping.services.yml
```yaml
services:
  shipping.rates:
    class: \Drupal\shipping\ShippingRateCalculator
    tags:
      - { name: service_collector, tag: 'shipping_rate', call: 'addRate' }

  shipping.rate.canada:
    class: \Drupal\shipping\ShippingRate\ShippingRateCanada
    tags:
      - { name: 'shipping_rate' }

  shipping.rate.uk:
    class: \Drupal\shipping\ShippingRate\ShippingRateUK
    tags:
      - { name: 'shipping_rate' }

  shipping.rate.japan:
    class: \Drupal\shipping\ShippingRate\ShippingRateJapan
    tags:
      - { name: 'shipping_rate' }
```      

---
# Calculating the Cost

```php
    $rates = \Drupal::service('shipping.rates');
    $rate = $rates->process($country_code);
    $shipping_cost = $rate->calculate());
```




---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]