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
- Why Automate?
- Behat and Drupal
- Behavior Driven Development (BDD) Principles
- Speaking in Gherkin
- DrupalExtension Project
- Demo

???
- Why automated testing is necessary 
- Where Behat fits amongst the many testing tools available for Drupal
- The principles behind Behavior Driven Development (BDD)
- Gherkin, the language used to write Behat tests
- Writing tests using the DrupalExtension project
- Executing Behat tests


---
# So Much Confusion
- Manual or automated
- Methodolgies: Unit, Integration, Acceptance, Performance, Security 
- Frameworks: Selenium, PhantomJS, Nightwatch, PHPUnit, Codeception, Behat, Drupal Test Traits
- Test First or Code First?

???
- clear up some confusion
- 


---
class: center, middle
# Why Automate?
- speed
- consistency
- accuracy


???
- People generally know it's good to have automated tests
- But they may not know all the benefits for having or the risks of not having automated tests


- We all know why it is necessary to test but why the need to automate it?
  - speed, consistency, accuracy



---
# Risk Management
- What is the cost for
  - defaced website? - reputation
  - stolen data? - reputation, angry users, lawsuits, 
  - site being down? - reputation, lost sales and ad revenue


???
- starts with risk management


---
# Change Happens

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
# Automation Speed, Consistency & Quality
- Speed
  - Execution almost always faster
  - Slow tests can be run on separate machine
- Consistency
  - Very consistent, does what it's told
  - Humans tend to skip over tests
- Quality
  - Only as good as the person(s) writing the tests
  - Human tester can better identify errors


???
- Automation Speed
  - Once written, automated tests will always be faster than what a human tester can do
  - Slow running tests can be ran in the background on a separate machine
- Consistency
  - Automated tests will always run in the same sequence, performing the same things as instructed
  - human testers tend to skip over tests when they feel a step may not be necessary   
 

---
class: center, middle
# Behat and Drupal

???
- Testing for performance and security have different requirements which Behat nor PHPUnit does not support
- While PHPUnit can be used for User Acceptance Tests, as we will see later on, Behat provides a framework which makes it easy to transform written user stories into automated tests.
- Easy for non-developers to understand and therefore help define the tests



---
class: center, middle
# Behavior Driven Development (BDD) Principles
From "Behavior-driven_development" in Wikipedia:
- "define a test set for the unit first;"
- "make the tests fail;"
- "then implement the unit;"
- "finally verify that the implementation of the unit makes the tests succeed."


---
# Example Behavior

```
Scenario: Customer checkout
	Given I am logged in as a customer
	And I have placed the following items in my shopping cart:
      | Soap       | 6.50 |
      | Toothpaste | 3.25 |
      | Shampoo    | 8.00 |
    When I checkout
    Then I should see an invoice amount for "17.75"
```



???
- based on the principle of creating your tests first and then developing your application
- initially, all your tests will fail but as your development progresses, they will all pass
- the idea is by defining your tests first, it forces you to think of all the scenarios that can occur and it prevents scope creep





---
class: center, middle
# Speaking in Gherkin


---
# Gherkin

```gherkin
Feature: Customer online ordering
  Scenario: Add items to shopping cart
    Given I am on the "catalog" page
    When I click "Add to cart" for item "Samsung Note 9"
    Then I should see "Samsung Note 9" in the shopping cart
 
  Scenario: Checkout
    Given I am on the "catalog" page
    And I see items in the shopping cart
    When I click "checkout"
    Then I should see the heading "Invoice"
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
   * Determine if an item is in the shopping cart.
   *
   * @Then I should see :item in the shopping cart
   */
  public function ItemIsInShoppingCart($item) {
    $actual_options = $this->getActualSelectOptions($arg1);

    // Check for differences.
    $diff_1 = array_diff($expected_options, $actual_options);
    if (!empty($diff_1)) {
      $diff_1 = implode(', ', $diff_1);
      throw new \Exception(sprintf("Expected item %s not found in shopping cart.", $item));
    }
  }
```


---
class: center, middle
# Drupal Extension Project



---
# Drupal Extension
- provide pre-defined step definitions 
- installed via composer

---
# Drupal Extension Examples

```gherkin
Given I am logged in as a/an :role
Given a/an :type (content )with the title :title
Given :vocabulary terms:
Given the cache has been cleared
```

---
class: center, middle
# Demo Time


---
# Q&amp;A

.center.middle[![image](../../../images/questionmarktie.jpg)]