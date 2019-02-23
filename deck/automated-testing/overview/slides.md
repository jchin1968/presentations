name: cover
class: center, middle
# Drupal Automated Testing<br>Overview
### Joseph Chin

---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../../images/google.png) ![image](../../../images/twitter.png) ![image](../../../images/linkedin.png) ![image](../../../images/facebook.png) ![image](../../../images/github.png)]
- Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/automated-testing/overview/index.html


---
# Topics
- Why Automate
- Test Tools
- What is Behat
- Speaking in Gherkin
- DrupalExtension Project
- Demo

???
- Why automated testing is necessary 
- What test frameworks and tools are available for Drupal
- Where Behat fits amongst the many testing tools available for Drupal
- The principles behind Behavior Driven Development (BDD)
- Gherkin, the language used to write Behat tests
- Writing tests using the DrupalExtension project
- Executing Behat tests


---
# Why Automate?
- Consistency
- Accuracy
- Speed

???
- we all know testing is a necessary step in software development
- Automating the test process improves the consistency and accuracy of the tests
- Consistency
  - Very consistent, does what it's told
  - Humans tend to skip over tests
- Accuracy
  - automated tests can be written to detect details which are easily missed by humans 
  but this is only as good as the person(s) writing the tests
  - Human tester can better identify errors which were not thought of  
- Speed is the real driver for automation since changes happen so frequently these days
- Consider the last Drupal security update that was first announced last Wednesday morning giving system admin just one day to apply a highly critical fix. 

  
---
# Frequency of Change

| Type of Change   | Frequency | Impact   |
| :---             | :---      | :---     |
| Business         | Varies    | High     |
| Drupal Core      | Monthly   | Med-High |
| Contrib Modules  | Weekly    | Med-High |
| PHP/JS Libraries | Weekly    | Med-Low  |
| OS and Platform  | Weekly    | Low      |

???
- Change happens frequently, whether you want it to or not
- often time, the change is out of your control such as a security patch 
- Can your manual testers keep up?


---
# Types of Tests
- Unit
- Integration
- Functional
- Acceptance
- Performance
- Penetration

???
- Unit - individual functions or methods
- Integration - interaction between two systems
- Functional - verify business requirements by development team using Behat or PHPUnit
- Acceptance - validation by end-users using Behat
- Performance - how fast pages load up, handling user load
- Penetration - security

---
# Tools for Drupal
- Unit, Integration
  - PHPUnit
- Functional, Acceptance
  - PHPUnit, Test Traits, Selenium, Behat
- Performance
  - ApacheBench, JMeter, Siege
- Penetration
  - Kali Linux - Nmap, Metasploit


???
- While PHPUnit can be used for functional and/or user acceptance tests, as we will see later on, 
Behat provides a framework which makes it easy to transform written user stories into automated tests
- Behat is easy for non-developers to understand and therefore they can help define the tests

---
# What is Behat?
- PHP implementation of Cucumber
- Behavior Driven Development (BDD)
- Human-Readable Stories

???
- PHP implementation of Cucumber which is a Ruby test framework based on BDD (behavior driven development)
- Other programming languages have their own version of cucumber
  - python = Behave
  - java = jBehave
  - .net = specflow
  - node = cucumberjs
- BDD is a development practise that follows the principles of TDD
  - create the tests first, then implement the solution.
  - initially, all your tests will fail but as your development progresses, more and more of them will pass until 
  you have all your tests passing and you know you are done
  - by defining the tests first, it forces developers to think of all the different possibilities that can occur
  - it also limits scope creep
- BDD differs from TDD
  - TDD is for developers
  - BDD if for everyone
- While proponents of Behat encourages BDD, they also feels it's ok to develop behat tests after the fact 
- this presentation is not about whether BDD is right or wrong for you but about the Behat tool
- Create human-readable stories using a language called Gherkin to create tests based on the behavior (i.e. outcome)
  - human-readable = understandable by non-programmers

---
# Speaking in Gherkin
```gherkin
Feature: Online Shopping
  In order to shop online
  As a customer
  I want to add items to a cart and checkout  

  Scenario: Add to shopping cart
    Given I am on the page "catalog/cameras"
    When I click "Add to cart" for item "GoPro Camera"
    Then I should see "GoPro Camera" in my shopping cart
 
  Scenario: Checkout Process - Invoicing
	Given I am logged in as a "customer"
	And I have the following items in my shopping cart:
	  | Item          | Price  | Quantity |  
      | GoPro Camera  | 400.00 | 1        |
      | GoPro Battery | 50.00  | 3        |
    When I click "checkout"
    Then I should see the heading "Invoice"
    And I should see the message "Please Pay $550.00"
  ...
```

???

- Is a language used to define automated tests
- Start by defining a Feature, then Scenario and then Steps
- The feature, scenarios and steps  written above by itself doesn't actually do anything
- Behind the scene, there are PHP methods which recognizes the step definition and execute them accordingly

---
# PHP Context

```php
  /**
   * Assert item is in shopping cart.
   *
   * @Then I should see :item in my shopping cart
   */
  public function AssertItemInShoppingCart($expected_item) {
    $session = $this->getSession();
    $items = $session->getPage()->findAll('css', '.cart-item');
    foreach ($items as $item) {
      if ($item->getText() == $expected_item) {
        return;  
      };
    }
    throw new \Exception("Expected item not found in cart.");    
  }
```


---
# Drupal Extension
- Contributed project
- Pre-defined step definitions for Drupal


```gherkin
Given I am logged in as a "Content Editor"

Given an "Article" with the title "Hello World"

Given "News Category" terms:
  | Sports        |
  | Entertainment |
  | Science       |

Given the cache has been cleared
```

---
class: center, middle
# Demo


---
# Behat Deep Dive Workshop
- Two (2) half-day workshops on:
  - Installing and configuring Behat
  - Writing tests using Drupal Extension
  - Creating custom step definitions
- The Hive Carpenter, 36 Carpenter Road, Level 2
- 3:00-700 pm, March ? and ?, 2019
- $75 for both days
- Sign up at https://www.eventbrite.com 



---
# Q&amp;A
.center.middle[![image](../../../images/questionmarktie.jpg)]

