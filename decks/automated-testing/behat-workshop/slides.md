name: cover
class: center, middle
# Drupal Behat Workshop
### Joseph Chin<br>Drupal Solution Architect

---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../../images/google.png) ![image](../../../images/twitter.png) ![image](../../../images/linkedin.png) ![image](../../../images/facebook.png) ![image](../../../images/github.png)]


---
# Topics For Today
- Testing Basics
- Understanding Behat and Gherkin
- Installing and Configuring
- Writing Features
- Writing Custom Step Definitions

---
class: center, middle
# Testing Basics

---
# Why Test?
- Expose bugs
- Improve quality
- Force users to think through business rules and processes
- Validate requirements are met


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
# Why Speed Matter

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
# Understanding Behat and Gherkin

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
- The feature, scenarios and steps written above by itself doesn't actually do anything
- Behind the scene, there are PHP methods which recognizes the step definition and execute them accordingly


---
# Feature File Structure

```gherkin
@some-tag
Feature: A Short Title
  In order to [Benefit]
  As a [Role]
  I want [Feature]
  
  Scenario: Example 1
    # Step Definitions beginning with Given, When, Then, And or But
    Given [Pre-condition] 
    When [Action]
    Then [Outcome] 

  @another-tag
  Scenario: Example 2
    ...
    ...      

  Scenario: Example 3
    ...
    ...      
```

---
# Step Definition Format
- Must start with one of the following keywords: **Given, When, Then, And, But**
- Keywords are equivalent and interchangeable. Your choice of keyword is for human readability
- Text following a keyword is the "Step Text Pattern"
- Within a pattern, you can have tokens. **customer**  and **5** are tokens for these examples:

```gherkin
Given I am logged in as a "customer"
Then I should see 5 items

```

---
class: center, middle
# Installing and Configuring

---
# Install Drupal Extension
- cd /var/www/workshop
- composer require drupal/drupal-extension
- vendor/bin/behat -V
- Optional
  - alias behat="/var/www/workshop/vendor/bin/behat -c /var/www/workshop/tests/behat/behat.yml /var/www/workshop/tests/behat/features"

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
???
- Create in ../tests/behat/ folder


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
name: useful-behat-commands
# Useful Behat Commands
- behat --init
  - Initialize behat environment
- behat -dl
  - list all step definitions
- behat -dl | grep {some_word}
  - list step definitions filtered by {some_word}
- behat -d {some_word} 
  - list detailed step definitions filtered by {some_word}
- behat
  - run all behat test
- behat {...}/features/specific_file.feature
  - run tests for a specific feature file. BUT, currently not working!   
- behat --tags={some_word}
  - run all tests that are tagged with {some_word}
- behat -v
  - run tests with detailed output
- behat -h
  - display help information   


---
# What is Selenium?
- Framework for testing web applications
- Selenium IDE 
  - record browser interactions into a script that can be played back
  - does not require coding
  - Firefox and Chrome add-ons
- Selenium WebDriver
  - Create test scripts using one of many supported languages including Java, C#, Ruby, Python and JavaScript
  - PHP not offically supported by SeleniumHQ but Behat provides a Mink Selenium driver
  
???
- Mink is a middleware between your web application and a browser
- By default behat uses the Goutte browser which is a text-based browser for executing tests
- With Selenium WebDriver, the tests can be executed using a graphical browser such as Chrome or Firefox which allows for javascript and css testing  


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
# General Requirements 
- Create an online training request form for all employees to use
- The request form will need to have a description, training dates, the estimated cost and the approving manager's name 
- The request form will be visible to employees only
- Managers will approve or deny requests online
- Managers can see any application while staff employees can see only their own

---
# User Stories
As a &lt;type of user&gt;, I want &lt;some goal&gt; so that &lt;some reason&gt;

1. As an employee, I want to request training courses to further my skills (Epic story)
1. As an employee, I want to access the training request form
1. As a non-employee, I should not have access to the training request form

---
name:user-stories-cont
# User Stories (cont.)
1. As an employee, when I go to the training request form, I want to fill in the following fields: Short Description, Purpose, Manager, Start Date, End Date and Estimated Cost
1. As an employee, when I go to the training request form, the manager field should be pre-filled with my manager's name
1. As an employee, after I submit a training request form, I should see a confirmation message and a summary of the values I entered


---
# Convert User Stories to Gherkin
(1) As an employee, I want to request training courses to further my skills (Epic story)

```gherkin
Feature: Request for training
  In order to further my skills
  As an employee
  I would like to request training courses
```

???
- feature description can be copied verbatim
- note the feature description is not interreted by behat. It is for information purposes only


---
# Convert User Stories to Gherkin
(2) As an employee, I want to access the training request form

```gherkin
Feature: Request for training
  ...
  ... 

  Scenario: Request form accessible to staff users
    Given I am logged in as a "Staff"
    When I visit "node/add/training_request"
    Then I should see the heading "Create Training Request"
```

---
# Convert User Stories to Gherkin
(3) As a non-employee, I should not have access to the training request form

```gherkin
Feature: Request for training
  ...
  ...

  Scenario: Request form not accessible to anonymous users
    Given I am an anonymous user
    When I visit "node/add/training_request"
    Then I should see the heading "Access denied"
    And I should see the text "You are not authorized to access this page."
```

---
# Convert User Stories to Gherkin
(4) As an employee, when I go to the training request form, I want to fill in the following fields: Short Description, Purpose, Manager, Start Date, End Date and Estimated Cost

```gherkin
Feature: Request for training
  ...
  ...
  
  Scenario: Submit Form
    Given users:
      | name    | email           | roles   | status | field_manager |
      | Joe     | joe@test.bot    | Manager | 1      |               |
      | Oliver  | oliver@test.bot | Staff   | 1      | Joe           |  
    And I am logged in as "Oliver"
    And I visit "node/add/training_request"
    When I fill in the following:
      | Short Description | Behat Workshop                      |
      | Purpose           | Need to implement automated testing |
      | Manager           | Joe                                 |
      | Start Date        | 04/20/2019                          |
      | End Date          | 04/22/2019                          |
      | Estimated Cost    | 75.00                               |
```

???
 - two examples of tables to specify a set of data
 - for users, we are creating multiple user records
 - for node, we are assigning values to fields for one node
 - Note the use of field ids for users and field labels for node 

---
# Convert User Stories to Gherkin
(6) As an employee, after I submit a training request form, I should see a confirmation message and a summary of the values I entered

```gherkin
Feature: Request for training
  ...
  ...
  
  Scenario: Submit Form
    Given users:
      | name    | email           | roles   | status | field_manager |
      | Joe     | joe@test.bot    | Manager | 1      |               |
      | Oliver  | oliver@test.bot | Staff   | 1      | Joe           |  
    And I am logged in as "Oliver"
    And I visit "node/add/training_request"
    When I fill in the following:
      | Short Description | Behat Workshop                      |
      | Purpose           | Need to implement automated testing |
      | Manager           | Joe                                 |
      | Start Date        | 04/20/2019                          |
      | End Date          | 04/22/2019                          |
      | Estimated Cost    | 75.00                               |
*   And I press the "Save" button
*   Then I should see the success message "Training Request Behat Workshop has been created."
*   And I should see the link "Joe" in the "manager" region
*   And I should see "$75.00SGD" in the "estimated_cost" region   
```

???
- combining user story 4 and 6 into one scenario

---
# Convert User Stories to Gherkin
(5) As an employee, when I go to the training request form, the manager field should be pre-filled with my manager's name

```gherkin
Feature: Request for training
  ...
  ...
  
  Scenario: Auto-filled fields
    Given users:
      | name    | email           | roles   | status | field_manager |
      | Joe     | joe@test.bot    | Manager | 1      |               |
      | Oliver  | oliver@test.bot | Staff   | 1      | Joe           |   
    And I am logged in as "Oliver"
    When I visit "node/add/training_request"
    Then the "Manager" reference field should contain "Joe"  
```


---
# Background

Use background to add context for all scenarios in a single feature 

```gherkin
Feature: Request for training
  ...
  ...
  
*  Background:
*    Given users:
*      | name    | email           | roles   | status | field_manager |
*      | Joe     | joe@test.bot    | Manager | 1      |               |
*      | Oliver  | oliver@test.bot | Staff   | 1      | Joe           |

  Scenario: Submit Form
    Given I am logged in as "Oliver"
    ...
      
  Scenario: Auto-filled fields      
    Given I am logged in as "Oliver"
    ...

```



---
# Scenario Outline

Use Scenario Outline to run the same test but with different inputs  

```gherkin
Feature: Request for training
  ...
  ...
  
  Background:
    Given users:
      ...
      ...
      
  Scenario Outline: Auto-filled fields
    Given I am logged in as "<user>"
    When I visit "node/add/training_request"
    Then the "Manager" reference field should contain "<manager>"
    Examples:
      | user   | manager |
      | Martin | Jill    |
      | Oliver | Joe     |
      | Jill   | Moira   |
      | Joe    | Moira   |      
```

---
# Tagging

```gherkin
@api @javascript
Feature: Request for training
  ...
  ...
  
  @security
  Scenario: Request form accessible to staff users
    ...
    ...

  @current      
  Scenario: Auto-filled fields
    ...
    ...
  
```

???
- @api and @javascript are pre-existing tags
- @api allow use of step definitions that calls Drupal APIs
- @javascript executes using Selenium


---
class: lengthy-code
# Completed Request Feature

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
- note @api and @javascript at top -indicate to use Drupal APIs and Selenium for all tests within this feature file
- @api - required if we want to use Drupal specific steps definitions to setup or validate
- Background - execute the step definitions for every scenario
  - Creating users in the background so they can be referenced in later scenarios within the same feature 

- Note how rewriting the features required some changes in syntax but the general format did not change

- running the feature at this point will result in errors. Two reasons are:
  - website has not been configured
  - step definitions have not been defined (correctly) as indicated by the message "FeatureContext has missing steps"  


---
class: center, middle
# Site Building


---
# User Roles and Profile
- Create user roles "Manager" and "Staff"
- Create user entity reference field "Manager"
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
# Training Request Content Type
- Name: Training Request
- Description: Request approval for training
- Title field label: Short Description
- Add fields:
  - Manager - User Reference
  - Start Date - Date, Date only, Default to Current date
  - End Date - Date, Date only, Default to Current date
  - Estimated Cost - Number (float), Prefix $, Suffix SGD
- Rename Body field to Purpose

???
- New fields set to required and limited 1
- Purpose field - required should be unchecked

---
# User Permissions

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

???
- running test at this point will allow Scenarios #1 & #2 to pass but fails #3
- Comment out "Purpose", "Start Date" and "End Date" fields in test so we can test the submit feature
- 

---
# Customization - Auto-Fill Manager Field
behat_workshop.info.yml
```yaml
name: Behat Workshop
description: Custom module for Behat Workshop
package: Miscellaneous
type: module
core: '8.x'
```

---
# Customization - Auto-Fill Manager Field
behat_workshop.module
```php
<?php

use \Drupal\Core\Form\FormStateInterface;
use \Drupal\user\Entity\User;

/**
 * Implements hook_form_BASE_FORM_ID_alter().
 */
function behat_workshop_form_node_training_request_form_alter(&$form, FormStateInterface $form_state) {
  // Get logged in user's manager account and set it as the default value
  // for the Training Request form manager field.
  $current_user = User::load(\Drupal::currentUser()->id());
  $manager = User::load($current_user->get('field_manager')->target_id);
  if (!empty($manager)) {
    $form['field_manager']['widget'][0]['target_id']['#default_value'] = $manager;
  }
}
```


---
# Drupal Behat "Gotchas!"
- Cannot set CKEditor field using Selenium
  - Because CKEditor WYSIWYG is within an iframe
  - But, works fine for default text browser i.e. Goute
- Cannot find Date fields
  - Most fields use &lt;label&gt; tags but Date with calendar popup uses &lt;h4 class="label"&gt;
  - Can use ID or Name attribute instead of label but it's ugly. i.e. edit-field-start-date-0-value-date
- Cannot compare entity reference fields
  - Reference field value has entity ID appended to it that changes. i.e. Joe (123) 

---
class: center, middle
# Writing Custom Context

---
# Cannot set CKEditor field using Selenium
### Solution: Override default MinkContext fillField() method
- Create a class (i.e. MyMinkContext) that extends Drupal\DrupalExtension\Context\MinkContext
- Override the fillField() method
- Configure behat.yml to use your MyMinkContext class instead of the default MinkContext

---
class: lengthy-code
# Cannot set CKEditor field using Selenium

Create ../test/behat/features/bootstrap/MyMinkContext.php
```php
<?php

use Drupal\DrupalExtension\Context\MinkContext;
use Behat\Mink\Exception\ExpectationException;

*class MyMinkContext extends MinkContext {

  /**
   * Override MinkExtension\Context\MinkContext::fillField.
   */
  public function fillField($field, $value) {
    // Locate the field on the page.
*   $element = $this->getSession()->getPage()->findField($field);

    // Throw an error if the field cannot be found.
    if (empty($element)) {
      throw new ExpectationException('Can not find field: ' . $field, $this->getSession());
    }

    // Get the field ID. Throw an error if it cannot be found.
    $field_id = $element->getAttribute('id');
    if (empty($field_id)) {
      throw new ExpectationException('Can not find id for field: ' . $field, $this->getSession());
    }

    // Check if a corresponding CKEditor field exists.
    $cke_field_id = 'cke_' . $field_id;
*   $cke_element = $this->getSession()->getPage()->find('named', ['id', $cke_field_id]);
    if (empty($cke_element)) {
      // CKEditor object was not found.
      parent::fillField($field_id, $value);
    } else {
      // CKEditor object was found. Update the field using javascript.
*     $this->getSession()->executeScript("CKEDITOR.instances[\"$field_id\"].setData(\"$value\");");
    }
  }
}
```

---
# Cannot set CKEditor field using Selenium

In behat.yml
```yaml
default:
  suites:
    default:
      contexts:
        - FeatureContext
*       - MyMinkContext
        - Drupal\DrupalExtension\Context\DrupalContext
*#       - Drupal\DrupalExtension\Context\MinkContext
        - Drupal\DrupalExtension\Context\MessageContext
        - Drupal\DrupalExtension\Context\DrushContext
        - Drupal\DrupalExtension\Context\MarkupContext
  extensions:
    Behat\MinkExtension:
    ...
    ...
```



---
# Cannot find Date fields
### Solution: Create alternate findField() method
- In MyMinkContext class, create a findField() method
- in overridden FillField() method, use custom findField() instead of default one 
  
???
- Wasn't able to override Behat\Mink\Element\TraversableElement::findField()
- Probably should rename custom findField() method to avoid confusion  


---
# Cannot find Date fields

```php



```








---
# Cannot compare entity reference fields
- Solution: Create new step definition
  - Update request.feature to use new step definition
  - In MyMinkContext class, create step definition method using template provided by Behat


---
# Other Gotchas
- Success messages
- Asserting case sensitive text
- Different date formats on different browsers


---
# Q&amp;A

.center.middle[![image](../../../images/questionmarktie.jpg)]
