function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

ActiveAdmin.dialogMassFieldsUpdate = function (message, inputs, callback) {
  var html = '<form id="dialog_confirm" title="'.concat(
    message,
    '"><div style="padding-right:4px;padding-left:1px;margin-right:2px"><ul>',
  );

  for (var name in inputs) {
    var elem, opts, wrapper;
    var type = inputs[name];

    if (/^(datepicker|checkbox|text)$/.test(type)) {
      wrapper = "input";
    } else if ($.isArray(type)) {
      var _Array$from = Array.from(["select", "option", type, ""]);

      var _Array$from2 = _slicedToArray(_Array$from, 4);

      wrapper = _Array$from2[0];
      elem = _Array$from2[1];
      opts = _Array$from2[2];
      type = _Array$from2[3];
    } else {
      throw new Error(
        "Unsupported input type: {".concat(name, ": ").concat(type, "}"),
      );
    }

    var klass = type === "datepicker" ? type : "";
    html +=
      "<li>\n<input type='checkbox' class='mass_update_protect_fild_flag' value='Y' id=\"mass_update_dialog_"
        .concat(name, '" />\n<label for="mass_update_dialog_')
        .concat(name, '"> ')
        .concat(name.charAt(0).toUpperCase() + name.slice(1), "</label>\n<")
        .concat(wrapper, ' name="')
        .concat(name, '" class="')
        .concat(klass, '" type="')
        .concat(type, '" disabled="disabled">') +
      (opts
        ? (function () {
            var result = [];

            for (
              var _i2 = 0, _Array$from3 = Array.from(opts);
              _i2 < _Array$from3.length;
              _i2++
            ) {
              var v = _Array$from3[_i2];
              var $elem = $("<".concat(elem, "/>"));

              if ($.isArray(v)) {
                $elem.text(v[0]).val(v[1]);
              } else {
                $elem.text(v);
              }

              result.push($elem.wrap("<div>").parent().html());
            }

            return result;
          })().join("")
        : "");

    if (wrapper === "select") {
      html += "</".concat(wrapper, ">");
    }

    html += "</li>";

    var _Array$from4 = Array.from([]);

    var _Array$from5 = _slicedToArray(_Array$from4, 5);

    wrapper = _Array$from5[0];
    elem = _Array$from5[1];
    opts = _Array$from5[2];
    type = _Array$from5[3];
    klass = _Array$from5[4];
  } // unset any temporary variables

  html += "</ul></div></form>";
  var form = $(html).appendTo("body");
  $("body").trigger("mass_update_modal_dialog:before_open", [form]);
  return form.dialog({
    modal: true,
    dialogClass:
      "active_admin_dialog active_admin_dialog_mass_update_by_filter",
    maxHeight: window.innerHeight - window.innerHeight * 0.1,
    open: function open() {
      $("body").trigger("mass_update_modal_dialog:after_open", [form]);
      return $(".mass_update_protect_fild_flag").on("change", function (e) {
        if (this.checked) {
          return $(e.target)
            .next()
            .next()
            .removeAttr("disabled")
            .trigger("chosen:updated");
        } else {
          return $(e.target)
            .next()
            .next()
            .attr("disabled", "disabled")
            .trigger("chosen:updated");
        }
      });
    },
    buttons: {
      OK: function OK(e) {
        $(e.target)
          .closest(".ui-dialog-buttonset")
          .html("<span>Processing. Please wait...</span>");
        return callback($(this).serializeObject());
      },
      Cancel: function Cancel() {
        $(".mass_update_protect_fild_flag").off("change");
        return $(this).dialog("close").remove();
      },
    },
  });
};
