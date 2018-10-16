name: cover
class: center, middle
# Drupal 8 Unit Testing
### Joseph Chin<br>Singapore Drupal Meetup<br>October, 2018

---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
- Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/2018-10_unit-testing/index.html


---
# Agenda


---
# Testing in Drupal 8
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
# What is Unit Testing?
- typically done by a developer, not a tester
- performed on a single method or function
- test on small, discrete units i.e. the smallest testable part 
  

---
# Business Requirements
## Take a user inputted sentence and transform it to one of the following:
- Randomly mix the order of the words
- Reverse the order of the words
- Make all the letters uppercase
- Make all the letters lowercase
- Translate to Pig Latin


---
# What is Pig Latin?
- English language kids game. 
- Take the first letter of each word, put it in the back and add "ay"

| English | Pig Latin |
| :---   | :---   | 
| Drupal Rock | rupalday ockray |
| Testing is good | estingay siay oodgay |
| Welcome to the meetup | elcomeway otay hetay eetupmay |


---
# Implementation
- Custom field with a textarea and dropdown box to select the transformer
- attach field to a content type

---
# Demo
- Demonstrate the field
- Show the code, specifically the transformer plugins

---
# How to Create the Test



---
# Custom Module Directory Structure

```text
/text_transformer
|-- text_transformer.info.yml
|-- /src
|   |-- /Plugin
|   |   |-- /Field
|   |   |   |-- /FiledFormatter
|   |   |   |-- /FieldType
|   |   |   |-- /FiledWidget  
|   |-- /TextTransformer
|   |   |-- Lower.php
|   |   |-- Reverse.php
|-- /tests
|   |-- /src
|   |   |-- /Functional
|   |   |-- /Kernel  
|   |   |-- /Unit  
|   |   |-- |-- LowerTest.php  
|   |   |-- |-- ReverseTest.php
```




---
# Creating a Test Class
```php
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
# Setup
- Create phpunit.xml with the following:

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
# Running a Test
- vendor/bin/phpunit











---
# References
- https://www.lullabot.com/articles/an-overview-of-testing-in-drupal-8

---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]