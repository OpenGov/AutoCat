var fs = require('fs');
var esprima = require('esprima-fb');
var Syntax = require('esprima-fb').Syntax;
var _ = require('lodash');



function traverse(node, func) {
  func(node);//1
  for (var key in node) { //2
    if (node.hasOwnProperty(key)) { //3
      var child = node[key];
      if (typeof child === 'object' && child !== null) { //4

        if (Array.isArray(child)) {
          child.forEach(function(node) { //5
            traverse(node, func);
          });
        } else {
          traverse(child, func); //6
        }
      }
    }
  }
}



var code ="var Avatar = React.createClass({"+
"  propTypes: {"+
"    id: React.PropTypes.number.isRequired,"+
 "   size: React.PropTypes.oneOf(['small', 'medium', 'large']),"+
"  },"+
  "render:function(){"+

 " }"+
"});";



//var code = fs.redFileSync("/Users/opengov/WebstormProjects/Ovid/dist/javascripts/jsx/avatar.js");










function getComponentProps(object) {

  if (object &&
    object.type === Syntax.ObjectExpression &&
    object.properties.length &&
    object.properties[0].type === Syntax.Property &&
    object.properties[0].key.name === 'propTypes') {

    console.log(_.map(object.properties[0].value.properties, function (e) {
    //  return e.key.name; //prop name
      if(e.value.property) {
        return e.key.name + " = " + e.value.property.name; //last fragment of value
      }
    }));

  }
}




function getComponentName(displayName, object) {
  if (object &&
    object.type === Syntax.CallExpression &&
    object.callee.type === Syntax.MemberExpression &&
    object.callee.object.type === Syntax.Identifier &&
    object.callee.object.name === 'React' &&
    object.callee.property.type === Syntax.Identifier &&
    object.callee.property.name === 'createClass' &&
    object['arguments'].length === 1 &&
    object['arguments'][0].type === Syntax.ObjectExpression) {

      console.log(displayName);

  }
}

function visitReactDisplayName(node){
  var left, right;

  if (node.type === Syntax.AssignmentExpression) {
    left = node.left;
    right = node.right;
  } else if (node.type === Syntax.Property) {
    left = node.key;
    right = node.value;
  } else if (node.type === Syntax.VariableDeclarator) {
    left = node.id;
    right = node.init;
  }

  if (left && left.type === Syntax.MemberExpression) {
    left = left.property;
  }
  if (left && left.type === Syntax.Identifier) {
    getComponentName(left.name, right);
  }

}



//var componentDir = '/Users/opengov/WebstormProjects/ReportApp/javascripts/'





var componentDir = '/Users/opengov/WebstormProjects/Ovid/dist/javascripts/jsx/';

fs.readdir(componentDir, function (err, files) {
  if (err) throw err;

  files.filter(function(f){ return f.indexOf(".js") != -1}).forEach( function (file) {

    console.log(file);

    var code = fs.readFileSync(componentDir + file);


    var root =  esprima.parse(code);


    traverse(root, function(object) {
     // visitReactDisplayName(object);

      getComponentProps(object);


    });

  });
});




/*

var root =  esprima.parse(code);
 traverse(root, function(object) {

   if (object &&
     object.type === Syntax.ObjectExpression &&
     object.properties.length &&
     object.properties[0].type === Syntax.Property &&
     object.properties[0].key.name === 'propTypes')
     {

     console.log(_.map(object.properties[0].value.properties,function(e){return e.key.name; }));

   }

 });
*/




/*
var root =  esprima.parse(code);




//Get the component name:
traverse(root, function(node) {
  if(node.type == "VariableDeclaration" && node.declarations[0].init.callee  && node.declarations[0].init.callee.property   ){
    console.log(node.declarations[0].id.name );
  }

});


//&&    node.declarations[0].init.callee.property.name === "createClass"



traverse(root, function(node) {
  if(node.type == "Property" && node.key.name === "propTypes"){
    console.log(_.pluck(node.value.properties,"key") );
  }

});


*/


