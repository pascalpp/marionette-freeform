fs        = require('fs');
UglifyJS  = require("uglify-js");

var removeUMD = new UglifyJS.TreeTransformer(function(node) {
  var funcCall = new UglifyJS.AST_Call({
    expression: node.body[0].body.args[1],
    // pass arguments into self invoking func
    args: node.body[0].body.args[1].argnames
  });

  var statement = new UglifyJS.AST_SimpleStatement({
    body: funcCall,
    start: {
      // bring over comments
      comments_before: node.start.comments_before
    }
  });

  return new UglifyJS.AST_Toplevel({
    body: [statement]
  });
});

function unwrap(path, cb) {
  try {
    fs.readFile(path, "utf8", function(e, code) {
      cb(null, UglifyJS.parse(code)
             .transform(removeUMD)
             .print_to_string({
              "beautify": true ,
              "comments": true,
              "indent_level": 2
            }));
    });
  } catch(e) {
    cb(e, null);
  }
}

module.exports = unwrap;