name: cover
class: center, middle
# Drupal Automated Testing<br>Workshop 1
### Joseph Chin

---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
- jchin1968 on .media-icon[![image](../../../images/google.png) ![image](../../../images/twitter.png) ![image](../../../images/linkedin.png) ![image](../../../images/facebook.png) ![image](../../../images/github.png)]
- Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/automated-testing/workshop-1/index.html


---
# Topics
- Understanding Testing
- Speaking in Gherkin
- Setting Up Behat
- Writing Basic Tests

---
class: center, middle
# Understanding Testing

---
# Types of Tests
- Unit
- End-to-end
- Functional
- Smoke
- Performance
- Security
- Front-end
- Integration


???
- Unit - test individual methods
- End-to-end - checks a complete workflow i.e. online ordering which includes browsing, ordering, checkout and payment
- Functional - checks a specific process i.e checkout
- Smoke - key checks
- Performance - speed
- Security / vulnerability - check for permissions, security flaws, compliance
- Front-end - tests the visual appearance, missing content, etc.
- Integration - test the integration between systems - payment process


---
class: center, middle
# Speaking in Gherkin

---
class: center, middle
# Setting Up Behat

---
# behat.yml
```
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