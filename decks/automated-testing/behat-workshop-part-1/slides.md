name: cover
class: center, middle
# Drupal Behat Workshop Part 1
### Joseph Chin<br>Drupal Solution Architect

---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../../images/google.png) ![image](../../../images/twitter.png) ![image](../../../images/linkedin.png) ![image](../../../images/facebook.png) ![image](../../../images/github.png)]


---
# Topics
- Test Basics
- Behat and Gherkin
- Set Up
- Writing Tests

---
class: center, middle
# Understanding The Basics

---
# Why Test?
- Expose bugs 
- Improve user experience (UX)
-  

???
- bugs can cause significant monetary damage and even loss of human lives
- An online retail shop can be shutdown for hours or days due to a bug
- Bugs in navigational equipment have caused planes to crash 
- Bugs in medical software have prescribed incorrect dosages leading to patient deaths
- Fortunately, us in the Drupal world generally don't have such mission critical applications to worry about


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
class: center, middle
# Behat and Gherkin

---
# What is Behat?
- Behavior Driven Development (BDD) Framework For PHP
- Extends from Test Driven Development (TDD)
  - Tests first, then Code
- Based on outcome as it appears to an end-user
- Writing tests is a shared process between end users and developers
- Human-readable stories are easily automated

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
class: center, middle
# Setting Up Behat

---
# Install Drupal Extension
```
cd {project_folder}
composer require drupal/drupal-extension
vendor/bin/behat -V
```


---
name: behat-yml
# Create behat.yml
```yaml
default:
  suites:
    default:
      contexts:
        - FeatureContext
        - Drupal\DrupalExtension\Context\DrupalContext
        - Drupal\DrupalExtension\Context\MinkContext
        - Drupal\DrupalExtension\Context\MessageContext
        - Drupal\DrupalExtension\Context\DrushContext
  extensions:
    Behat\MinkExtension:
      goutte: ~
      javascript_session: selenium2
      selenium2: ~
*     base_url: http://autotest
    Drupal\DrupalExtension:
      api_driver: "drupal"
      drupal:
*       drupal_root: '/var/www/autotest/web'
      region_map:
        header: "#header"
        page_title: ".page-title"
      selectors:
        message_selector: '.messages'
        error_message_selector: '.messages.messages--error'
        success_message_selector: '.messages.messages--status'
```





---
class: center, middle
# Writing Basic Tests



---
# Q&amp;A

.center.middle[![image](../../../images/questionmarktie.jpg)]