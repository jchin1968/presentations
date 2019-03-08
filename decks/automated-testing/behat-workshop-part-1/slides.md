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
- Understanding Testing
- Speaking in Gherkin
- Setting Up Behat
- Writing Basic Tests

---
class: center, middle
# Understanding Testing

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
# Types of Tests
## Functional
- Unit
- Integration
- User Acceptance (UAT)
- Smoke

## Non-Functional
- Performance
- Security / Penetration
- Load / Scalability
## Maintenance
- Regression - re-running previous tests after some change to the software or environment




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

.center.middle[![image](../../images/questionmarktie.jpg)]