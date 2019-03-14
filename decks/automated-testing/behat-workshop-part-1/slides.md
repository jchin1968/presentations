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
```bash
cd {project_folder}
composer require drupal/drupal-extension
vendor/bin/behat -V
alias behat="/var/www/workshop/vendor/bin/behat"
```

---
# Install Selenium
- Prerequisites
  - Chrome Browser
  - Java JRE
- Download Selenium Standalone Server from https://www.seleniumhq.org/download/
- Download Google Chrome Driver from https://sites.google.com/a/chromium.org/chromedriver/

```bash
mkdir /opt/selenium
cd /opt/selenium
wget https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar
wget  

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
# Requirement Overview
Company want employees to request conference attendance and training using an online form. 
The form will be visible to employees only and managers will have the ability to request or 
deny submissions online.

---
# Business Requirements
- Only logged in employees will be able to access and submit requests for attending conferences and training
- Only the requester and their manager can see the application
- Request Form should contain following fields
  - Name - automatically filled with logged in user
  - Manager - automatically filled with value from user profile
  - Title - short description of event
  - Purpose
  - Date of attendance - from and to dates required
  - Estimated Cost
  - Status
- Workflow
  - Employee fills out form and submit
  - Manager receives notification
  - Manager approves or rejects application
  - Employee receives notification of decision

---
name: application-feature
# application.feature

```Gherkin
Feature: Request for conference and training
  In order to generate sales leads and/or to further my skills 
  As an employee
  I would like to request attendance for conferences and training courses

  Background:
    Given users:
      | name    | email           | roles   | status | manager |
      | Joe     | joe@test.bot    | Manager | 1      | Moira   |
      | Jill    | joe@test.bot    | Manager | 1      | Moira   |
      | Martin  | martin@test.bot | Staff   | 1      | Joe     |
      | Oliver  | oliver@test.bot | Staff   | 1      | Jill    |

  Scenario: Auto-filled fields
    Given I am logged in as "Oliver" 
    When I am on "conference-request"
    Then I should see "Oliver" in the "Name" field
    And I should see "Joe" in the "Manager" field
    
  Scenario: Submit Form
    Given I am logged in as "Martin"
    And I am on "conference-request"
    When I fill in the following:
      | Name           | Martin |
      | Manager        | Joe    |
      | Title          | DrupalCon Seattle 2019 |
      | Purpose        | To meet cool people |
      | Date Start     | 2019-04-08 |
      | Date End       | 2019-04-12 |
      | Estimated Cost | 5000 |
    And I click on "Submit"
    Then I should see "Thank you for submitting ...."

  Scenario: Notify manager of new request
  
  

  Scenario: Request form not accessible to anonymous users
    Given I am an anonymous user
    When I visit "conference-request"
    Then I should see the error message "No Access"
 
```

---
name: approval-feature
#approval.feature
```gherkin
Feature: Approve conference and training requests
  In order to streamline approval for conference and training requests
  As a manager
  I should be able to 
  
  Scenario
    Given "conferent request" content:
      | title   	   | Name   | Manager | Date Start | Date End   | moderation_state |
      | Behat Training | Martin | Joe     | 2019-03-27 | 2019-03-27 | Submitted        | 
    When I visit "pending-conference-request"
    Then I should see "Behat Training" in the "" region

```

---
# Q&amp;A

.center.middle[![image](../../../images/questionmarktie.jpg)]