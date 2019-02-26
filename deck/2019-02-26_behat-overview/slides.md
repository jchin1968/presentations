name: cover
class: center, middle
# Drupal 8 Behat Overview
### Joseph Chin<br>Singapore Drupal Meetup<br>February 26, 2019

---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
- Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/2019-02-26_behat-overview/index.html

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

| Type of Change   | Frequency   | Impact   |
| :---             | :---        | :---     |
| Business         | Varies      | High     |
| Drupal Core      | Bi-Monthly  | Med-High |
| Contrib Modules  | Bi-Weekly   | Med-High |
| PHP/JS Libraries | Bi-Weekly   | Med-Low  |
| OS and Platform  | Weekly      | Low      |
| Security         | Unscheduled | Varies   | 

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
  - PHPUnit, SimpleTest
- Functional, Acceptance
  - PHPUnit, SimpleTest, Test Traits, Selenium, Behat
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
- Behavior Driven Development (BDD) Framework For PHP
- Extends from Test Driven Development (TDD)
  - Tests first, then Code
- Based on outcome as it appears to an end-user
- Writing tests is a shared process between end users and developers
- Human-readable stories are easily converted to test scripts

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
   * @Then I should see :expected_item in my shopping cart
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
- Install using Composer
- Pre-defined step definitions specific to Drupal


```gherkin
Given I am logged in as a "Content Editor"
Given an "Article" with the title "Hello World"
Given "News Category" terms:
  | Sports        |
  | Entertainment |
  | Science       |
Given the cache has been cleared
```

???
- contributed open-source project
- provides pre-defined steps definitions for Drupal
- reduces the development time for writing behat tests


---
class: center, middle
# Demo


---
# Behat Workshop
- Full day workshop:
  - Installing and configuring Behat
  - Writing tests using Drupal Extension
  - Writing custom step definitions
  - Integrating Behat into your workflow
- The Hive Carpenter, 36 Carpenter Road, Level 2
- 10am-6pm, March 27, 2019
- $45 only!
- Sign up at https://www.eventbrite.com/e/drupal-behat-workshop-tickets-57374751426


---
# Q&amp;A
.center.middle[![image](../../images/questionmarktie.jpg)]

---
# References
- https://www.drupal.org/project/drupalextension
- https://behat-drupal-extension.readthedocs.io/en/3.1
- http://behat.org/en/latest
- http://kevinquillen.com/bdd/2014/06/08/your-first-behat-test
- https://www.lullabot.com/articles/an-overview-of-testing-in-drupal-8