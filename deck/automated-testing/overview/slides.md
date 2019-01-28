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
class: center, middle
# Why Automate?

???
- People generally know it's good to have automated tests
- But they may not know all the benefits for having or the risks of not having automated tests


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



---
class: center, middle
# Behavior Driven Development (BDD) Principles



---
class: center, middle
# Speaking in Gherkin



---
class: center, middle
# DrupalExtension Project



---
class: center, middle
# Demo Time


---
# Q&amp;A

.center.middle[![image](../../../images/questionmarktie.jpg)]