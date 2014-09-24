
#AutoCat
Automatically generate a React component catalog

![somecat](http://media0.giphy.com/media/CBZHRM5BG1BtK/200_s.gif "cat")


##Quick Start (this will generate a component catalog for Ovid)

```
git clone git@github.com:gurdasnijor/ReactDocGen.git
npm install
gulp build
gulp server
```


##What does it do?

Takes a component library (like Ovid) as an input and builds out a single page catalog app of all components


##What's it good for?

* Documentation
* Promotes component discovery (also minimizes rework)
* Quickly understand how a component functions without having to read implementation (behavior, look and feel, inputs/outputs)
* Prototyping/Development of new components -- `npm link` your local clone of Ovid and drop components you're developing in the `dist/javascripts/jsx` folder.  It'll be placed in the page next to inputs that could be useful for manual testing that provides visual feedback (in addition to your unit tests)


##How does it do it?

Uses [Facebook's fork of Esprima](https://github.com/facebook/esprima) to parse information from the component source files (descriptions in comments, type information, component names, etc) and then uses
that information to generate code that runs the component catalog.



##Next steps?

- Add the actual AST traversal logic for extracting data from source files
- 'Templatize' app.jsx to take the output from the above item and dynamically generate source to send to browserify
-  Generalize this to be able to point at an entire (non Ovid) source tree and extract and catalog all components