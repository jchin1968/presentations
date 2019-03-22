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
- cd /var/www/workshop
- composer require drupal/drupal-extension
- vendor/bin/behat -V
- alias behat="/var/www/workshop/vendor/bin/behat -c /var/www/workshop/tests/behat/behat.yml /var/www/workshop/tests/behat/features"

---
name: behat-yml
# Create ../tests/behat/behat.yml
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
        - Drupal\DrupalExtension\Context\MarkupContext
  extensions:
    Behat\MinkExtension:
      goutte: ~
      javascript_session: selenium2
      selenium2: ~
*     base_url: http://workshop
    Drupal\DrupalExtension:
      api_driver: "drupal"
      drupal:
*       drupal_root: '/var/www/workshop/web'
      region_map:
        page_title: ".page-title"
      selectors:
        message_selector: '.messages'
        error_message_selector: '.messages.messages--error'
        success_message_selector: '.messages.messages--status'
```

---
# Initialize Behat
- cd /var/www/workshop/tests/behat
- behat --init
- behat -dl

---
# Create homepage.feature
```gherkin
Feature: Homepage
  In order to have a good user experience
  As a user
  I want to have a starting point for my journey

  Scenario: Welcome
    Given I am an anonymous user
    When I am on the homepage
    Then I should see the heading "Welcome to Behat Workshop" in the "page_title"
```

Create in .../test/behat/features

???
- this is just a test feature to make sure Behat and Drupal Extension are working
- while this is a test feature, it can be used later on to test out the homepage if required
- create in ../features directory
- enter behat to execute test


---
# Install and Start Selenium Server
- Prerequisites: Chrome Browser, Java JRE
- Download Selenium Standalone Server from https://www.seleniumhq.org/download/
- Download Google Chrome Driver from https://sites.google.com/a/chromium.org/chromedriver/

```bash
mkdir /opt/selenium
cd /opt/selenium
wget https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar
wget https://chromedriver.storage.googleapis.com/73.0.3683.68/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
java -jar -Dwebdriver.chrome.driver=chromedriver selenium-server-standalone-3.141.59.jar

```

???
- Selenium can be run from a separate server than Drupal. Does not have to be localhost
- install chrome, java and chromedriver on host machine (for example) 
- then in behat.yml, selenium server IP address would be the host machine on the VM network interface, not the actual host machine IP address

---
# Update behat.yml

```yaml
default:
  suites:
    ...
    ...
  extensions:
    Behat\MinkExtension:
      goutte: ~
      javascript_session: selenium2
*     selenium2:
*       wd_host: http://localhost:4444/wd/hub
*       capabilities:
*         chrome:
*           switches:
*#             - "--headless"
*             - "--no-sandbox"
*             - "--window-size=1280,800"
*     browser_name: 'chrome'
      base_url: http://workshop
    Drupal\DrupalExtension:
      ...
      ...
```

---
# Update homepage.feature
```gherkin
Feature: Homepage
  In order to have a good user experience
  As a user
  I want to have a starting point for my journey

* @javascript
  Scenario: Welcome
    Given I am an anonymous user
    When I am on the homepage
    Then I should see the heading "Welcome to Workshop"

```


---
class: center, middle
# Writing Features


---
# Requirements - General
- Employees requesting training must use an online form 
- Request form will be visible to employees only
- Managers will approve or deny requests online
- Managers can see all applications. Requester can see only their own

???
- define some general business requirements, what the request form looks like and the workflow


---
# Requirements - Request Form
- Manager - automatically filled with value from user profile
- Short Description
- Purpose (future requirement)
- Training Dates (start and end)
- Date of submission
- Estimated Cost
- Status: Under Review, Approved, Rejected


---
# Requirements - Workflow
- Employee fills out form and submit
- Manager receives notification
- Manager approves or rejects application
- Employee receives notification of decision

???
- Will not be testing workflow due to time limitation


---
# Agile Story - Request Form

```Gherkin
Feature: Request for training
  In order to further my skills 
  As an employee
  I would like to request training courses

```

???
Define overall goal of the feature

---
# Agile Story - Request Form

```Gherkin
Feature: Request for training
  In order to further my skills 
  As an employee
  I would like to request training courses

  Scenario 1: Request form available to staff but not anonymous users
    As a staff user, I want to access the training request form
    As an anonymous user, I should not be able to access the training 
    request form

```


???
- writing agile user stories without being too specific to Drupal 
- Scenario 1 - Who get and don't get access to Training Request form


---
# Agile Story - Request Form

```Gherkin
Feature: Request for training
  In order to further my skills 
  As an employee
  I would like to request training courses

  Scenario 1: Request form available to staff but not anonymous users
    As a staff user, I want to access the training request form
    As an anonymous user, I should not be able to access the training request form

  Scenario 2: Submit Training Request
    As a staff user, when I go to the training request form
    I fill in the following: 
    - Manager
    - Short Description
    - Purpose
    - Start Date
    - End Date
    - Estimated Cost
    
    After I save the form, I should see a confirmation page with:
    - a success message
    - the values I have entered
```

???
Scenario 2 - Submitting training request
 

---
# Agile Story - Request Form

```Gherkin
Feature: Request for training
  In order to further my skills 
  As an employee
  I would like to request training courses

  Scenario 1: Request form available to staff but not anonymous users
    As a staff user, I want to access the training request form
    As an anonymous user, I should not be able to access the training request form

  Scenario 2: Submit Training Request
    As a staff user, when I go to the training request form
    I fill in the following: 
    - Manager
    - Short Description
    - Purpose
    - Start Date
    - End Date
    - Estimated Cost
    
    After I save the form, I should see a confirmation page with:
    - a success message
    - the values I have entered
        
  Scenario 3: Auto-filled fields
    As a staff user, when I go to the training request form
    I want to see the manager field pre-populated with my manager's name  
```

???
Scenario 3 - Validate fields are auto-filled


---
class: lengthy-code
# Convert Story to Behat

```gherkin
@api @javascript
Feature: Request for training
  In order to further my skills
  As an employee
  I would like to request training courses

  Background:
    Given users:
      | name    | email           | roles   | status | field_manager |
      | Moira   | joe@test.bot    | Manager | 1      |               |
      | Joe     | joe@test.bot    | Manager | 1      | Moira         |
      | Jill    | joe@test.bot    | Manager | 1      | Moira         |
      | Martin  | martin@test.bot | Staff   | 1      | Joe           |
      | Oliver  | oliver@test.bot | Staff   | 1      | Jill          |

  Scenario: Request form accessible to staff users
    Given I am logged in as a "Staff"
    When I visit "node/add/training_request"
    Then I should see the heading "Create Training Request"

  Scenario: Request form not accessible to anonymous users
    Given I am an anonymous user
    When I visit "node/add/training_request"
    Then I should see the heading "Access denied"
    And I should see the text "You are not authorized to access this page."

  Scenario: Submit Form
    Given I am logged in as "Martin"
    And I visit "node/add/training_request"
    When I fill in the following:
      | Manager           | Joe                                 |
      | Short Description | Behat Workshop                      |
      | Purpose           | Need to implement automated testing |
      | Start Date        | 03/28/2019                          |
      | End Date          | 03/29/2019                          |
      | Estimated Cost    | 50.00                               |
    And I press the "Save" button
    Then I should see the success message "Training Request Behat Workshop has been created."

  Scenario: Auto-filled fields
    Given I am logged in as "Oliver"
    When I visit "node/add/training_request"
    Then the "Manager" field should contain "Joe"
```

???
- create the file ../features/request.feature
- @api - required if we want to use Drupal specific steps definitions to setup or validate
- Background - execute the step definitions for every scenario
  - Creating users in the background so they can be referenced in later scenarios within the same feature 

- Note how rewriting the features required some changes in syntax but the general format did not change

- running the feature at this point will result in errors. Two reasons are:
  - website has not been configured
  - step definitions have not been defined (correctly) as indicated by the message "FeatureContext has missing steps"  

---
#Site Building - Users
- Create user roles "Manager" and "Staff"
- Create user entity referenced field "Manager"
  - Type: User
  - Label: Manager
  - Type of item to reference: User
  - Limited: 1
  - Required field: No

???
- first error we see is "No role Manager exists".
- Create Manager and Staff roles and rerun test
- Note field_manager has not been created yet but no errors!

---
# Site Building - Content Type
- Create Training Request Content Type
  - Name: Training Request
  - Description: Request approval for training
  - Title field label: Short Description
  - Add Fields:
      - Manager - User Reference
      - Start Date - Date, Date only, Default to Current date
      - End Date - Date, Date only, Default to Current date
      - Estimated Cost - Number (float), Prefix $, Suffix SGD
      - NB. all new fields should be required and limited to 1 
  - Rename Body field to Purpose, required unchecked
  
---
# Site Building - User Permission

| Permission         | Manager | Staff |
| :---               | :---    | :---  |
| Create new content | ✔       | ✔     |
| Delete any content | ✔       |       |
| Delete own content | ✔       | ✔     |
| Delete revisions   | ✔       |       |
| Edit any content   | ✔       |       |
| Edit own content   | ✔       | ✔     |
| Revert revisions   | ✔       |       |
| View revisions     | ✔       | ✔     |


























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