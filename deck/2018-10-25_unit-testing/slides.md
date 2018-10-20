name: cover
class: center, middle
# Drupal 8 Unit Testing
### Joseph Chin<br>Singapore Drupal Meetup<br>October 25, 2018

---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
- Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/2018-10-25_unit-testing/index.html


---
# Testing In Drupal 8
- PHPUnit
  - Now part of Drupal Core. Replaces SimpleTest.
  - Provides Unit, Kernel, Browser and JavaScript testing.
- SimpleTest
  - Still available in Drupal 8.6 but being deprecated
- Behat
  - Available for Drupal 8 and actively maintained
  - Stay tuned for meetups and workshops on the subject!
- Others
  - Selenium, CodeCeption
  
---
# What Is Unit Testing?
- Typically written by a developer during code development
- Test small, discrete units such as a method or a function
- Runs very quickly since Drupal does not need to be loaded

???
- written by developers as opposed to a BA or tester who would be writing behat tests or creating selenium tests 
- Selenium or Behat are for functional testing where the full Drupal site will be loaded.
- Kernel testing which falls between unit and functional tests, will load a small subset of Drupal


---
# When Not To Use Unit Testing
- Method being tested require too many *Test Doubles* i.e. dependencies
 

---
# Our Use Case
## Take a user inputted sentence and transform it to one of the following:
- Randomly mix the order of the words
- Reverse the order of the words
- Make all the letters uppercase
- Make all the letters lowercase
- Translate it to Pig Latin

---
name: our-implementation
# Our Implementation
- Custom text transformer field attached to an article content type
.text-transformer-field.middle[![image](text_transformer_field.png)]

???
- don't get too concern with how the field is created or how the transformer plugins are automatically detected
- focus on Text Transformer plugins in src/Plugin/TextTransformer

---
class: center, middle
# Demo
# Custom Text Transformer Field

---
# Writing Testable Code - Avoid This
```php

switch ($transformer_type) {
  case 'lower':
     $transformed = strtolower($text);
     break;

  case 'upper':
     $transformed = strtoupper($text);
     break;

  case 'reverse':
    $text_array = explode(' ', $text);
    $reverse_array = array_reverse($text_array);
    $transformed = implode(' ', $reverse_array);
    break;  
}
```

???
- Before you can write tests, your code has to be testable 

---
# Writing Testable Code - Do This
```php
switch ($transformer_type) {
  case 'lower':
     $transformed = new Lower($text);
     break;

  case 'upper':
     $transformed = new Upper($text)
     break;
     
  case 'reverse':
    $transformed = new Reverse($text);
    break;  
}
```

---
# Writing Testable Code - And This
```php
class Reverse extends {
  public __construct($text) {
    $text_array = explode(' ', $text);
    $reverse_array = array_reverse($text_array);
    $reverse_text = implode(' ', $reverse_array);
    return $reverse_text;  
  }
}
```

---
class: center, middle
# Demo
# Text Transformer Plugins

---
# Test Directory Structure

```text
text_transformer/
+-- src
¦   +-- Controller
¦   +-- Form
¦   +-- Plugin
¦   ¦   +-- Field
¦   ¦   +-- TextTransformer
¦   ¦       +-- Random.php
¦   ¦       +-- Reverse.php
*+-- tests
*¦   +-- src
*¦       +-- Unit
*¦           +-- Plugin
*¦               +-- TextTransformer
*¦                   +-- RandomTest.php
*¦                   +-- ReverseTest.php
+-- text_transformer.info.yml
+-- text_transformer.module
```

---
# Setup
- Create phpunit.xml in Drupal project root with the following:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="web/core/tests/bootstrap.php" colors="true">
  <testsuites>
    <testsuite name="unit">
      <directory>web/modules/custom/text_transformer/tests</directory>
    </testsuite>
  </testsuites>
</phpunit>
```


---
# Writing a Test Class
```php
namespace Drupal\Tests\text_transformer\Unit\Plugin\TextTransformer;

use Drupal\text_transformer\Plugin\TextTransformer\Reverse;
use Drupal\Tests\UnitTestCase;

class ReverseTest extends UnitTestCase {
  public function setup() {
  }
  
  public function tearDown() {
  }
  
  public function testReverseTransformer() {
  } 
}
```

---
# Extending the Setup Method
```php
public function setUp() {
  $this->textTransformer = new Reverse();
}
```

---
# Extending the Tear Down Method
```php
public function tearDown() {
  unset($this->textTransformer);
}
```

---
# Writing the Test Method

```php
class ReverseTest extends UnitTestCase {

  public function testReverseTransformer() {
    $text = 'The quick brown fox';
    $expected = 'fox brown quick The';
    $actual = $this->textTransformer->transform($text);
    $this->assertEquals($expected, $actual);
  }
}
```


---
# Running a Test
- vendor/bin/phpunit


---
# Data Providers

```php



```







# Exercise
- Create tests for 








---
# References
- https://www.lullabot.com/articles/an-overview-of-testing-in-drupal-8

---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]