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
# One Solution
- Declare  

---
# Declare a class per country 

.../mymodule/src/ShippingRate/ShippingRateCanada.php
```php
class ShippingRateCanada {  
  public function calculate($packageSpecs) {
    ...
    return $shippingCost;
  }
}
```
.../mymodule/src/ShippingRate/ShippingRateJapan.php
```php
class ShippingRateJapan {  
  public function calculate($packageSpecs) {
    ...
    return $shippingCost;
  }
}
```



---
# One possible Way (cont.)
Method or function with a switch-case statement.

```php
switch ($country) {
  case 'ca':
    $rate = new ShippingRateCanada();
    break;
  case 'jp':
    $rate = new ShippingRateJapan();
    break;
}

$shipping_cost = $rate->calculate($packageSpecs);

```
---
# One possible Way (cont.)

Problem: how does one modify it without changing the core class.

Solution 1: extend class and override the method. What happens when original developer updates the list of countries?

Solution 2: service collectors!!


---
# Service Collectors
- Rewrite each country class as so:

.../shipping/src/ShippingRate/ShippingRateCanada.php
```php
class ShippingRateCanada implements ShippingRateInterface {

  public function calculate() {
    $rate = 1;
    return $rate;
  }

  public function countryCode() {
    return 'ca';
  }

}

```

---
# ShippingRateCalculator
.../shipping/src/ShippingRateCalculator.php

```php
class ShippingRateCalculator {
  private $rates = [];

  public function addRate(ShippingRateInterface $rates) {
    $this->rates[$priority][] = $rates;
  }

  public function process($country_code) {
    $this->sortRates();
    foreach ($this->rates as $rate) {
      if ($rate->countryCode() == $country_code) {
        return $rate;
      }
    }
    return NULL;
  }
}

```



---

# shipping.services.yml
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
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]