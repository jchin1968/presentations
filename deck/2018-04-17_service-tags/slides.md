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
- Bike store with shipments to various countries
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
  case 'uk':
    $shipping_cost = calculate_shipping_uk($package_specs);
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

function calculate_shipping_uk($package_specs) {
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
  case 'uk':
    $shipping = new ShippingUk();
    break;    
}

$shipping_cost = $shipping->calculate($packageSpecs);

```

---
# Object Oriented Way

Create a class per country 

.../bikeshop/src/Shipping/ShippingCanada.php
```php
class ShippingCanada implements ShippingInterface {  
  public function calculate($packageSpecs) {
    ...
    return $shippingCost;
  }
}
```
.../bikeshop/src/Shipping/ShippingJapan.php
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
# Improve on it

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