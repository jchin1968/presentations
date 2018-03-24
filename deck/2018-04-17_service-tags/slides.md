name: cover
class: center, middle
# Drupal 8 Service Tags
### Joseph Chin<br>Singapore Drupal Meetup<br>April 17, 2018


---
# Hello
- Joseph Chin
- Drupal Solution Architect since 2007
- Singapore Drupal Meetup committee member
* jchin1968 on .media-icon[![image](../../images/google.png) ![image](../../images/twitter.png) ![image](../../images/linkedin.png) ![image](../../images/facebook.png) ![image](../../images/github.png)]
* Follow along here: https://rawgit.com/jchin1968/presentations/master/deck/2018-04-17_service-tags/index.html


---
# Agenda


---
# Evolution of customizing software
- hack core
- hooks
- service collectors

???
- In the old days when working with pre-made software, custom changes were made directly on the core source code
- When I started with drupal 6, they introduced me to the concept of hooks and I thought, man this is great!
- Now, with Drupal 8, we have service collectors


---
# What is so wrong with using hooks?
 -all functions are loaded initially which is slow and a waste of memory
- passing along giantic arrays and object elements makes them difficult to manipulate

???
- fine for the time when PHP was not object oriented friendly


---
# Our use case
- user registration with a country field
- depending on which country they register themselves as they will get a different message


---
# One possible way

Method or function with a switch-case statement.

```php
switch ($country) {
  case 'ca':
    return 'Welcome fellow Canuck! Enjoy your poutine.';
    break;
  Case USA
    return 'Hello fellow Yank!';
    break;
  Case Singapore
  Case Australia

```

Problem: how does one modify it without changing the core class.

Solution 1: extend class and override the method. What happens when original developer updates the list of countries?

Solution 2: service collectors!!


---
# Q&amp;A

.center.middle[![image](../../images/questionmarktie.jpg)]