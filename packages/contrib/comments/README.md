README: comments

You must install socket, prior to installing comments which can be done by mean install socket.
This will be added as a dependency in the near future.


To include comments, for now, you should just mention the same on


For example on -:

articles/views/view.html or articles/views/list.html

<div>{{article.content}}</div>
<!--Insert here -->
<div ng-if="article !== undefined" ng-include="'comments/views/index.html'" data-ng-controller="CommentsController" data-ng-init="findComments(article, 2)"/>
<!-- Voila, you are done. Were you expecting some more steps? :-) -->

