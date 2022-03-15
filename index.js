try {
  function UnityProgress() {
    var l = true, r = 0, s = 0;
    function n(e) {
      var t = document.getElementById("loading-info");
      t && (t.innerHTML = e);
    }
    window.requestAnimationFrame(function e() {
      var t;
      s = (1 - (t = .2)) * s + t * r;
      var n = 200 * Math.min(s, 1);
      document.getElementById("progress-bar").style.width = n + "px";
      var o = document.getElementById("loading-box"), d = document.getElementById("#canvas");
      null !== d && (o.style.width = d.clientWidth + "px", o.style.height = d.clientHeight + "px"), l && window.requestAnimationFrame(e);
    });
    var o = false;
    this.setProgress = function (e, t) {
      null != e.Module && (o || (e.Module.postRun.push(function () {
        console.log("post-run hook called!");
        var e = document.getElementById("loading-box");
        e.parentNode.removeChild(e);
      }), o = true)), n((100 * (r = t)).toFixed(0) + "%"), .9 <= t && 1 != t ? (l = false, n("Getting Ready..."), document.getElementById("bg-bar") && (document.getElementById("bg-bar").style.display = "none"), document.getElementById("progress-bar") && (document.getElementById("progress-bar").style.display = "none")) : 1 == t && (l = false, n("Almost There..."), document.getElementById("bg-bar") && (document.getElementById("bg-bar").style.display = "none"), document.getElementById("progress-bar") && (document.getElementById("progress-bar").style.display = "none"), document.getElementById("spinner") && (document.getElementById("spinner").style.display = ""));
    };
  }
  ;
} catch (e) {}
try {
  (function ($) {
    "use strict";
    if (typeof wpcf7 === "undefined" || wpcf7 === null) {
      return;
    }
    wpcf7 = $.extend({cached: 0, inputs: []}, wpcf7);
    $(function () {
      wpcf7.supportHtml5 = function () {
        var features = {};
        var input = document.createElement("input");
        features.placeholder = "placeholder" in input;
        var inputTypes = ["email", "url", "tel", "number", "range", "date"];
        $.each(inputTypes, function (index, value) {
          input.setAttribute("type", value);
          features[value] = input.type !== "text";
        });
        return features;
      }();
      $("div.wpcf7 > form").each(function () {
        var $form = $(this);
        wpcf7.initForm($form);
        if (wpcf7.cached) {
          wpcf7.refill($form);
        }
      });
    });
    wpcf7.getId = function (form) {
      return parseInt($('input[name="_wpcf7"]', form).val(), 10);
    };
    wpcf7.initForm = function (form) {
      var $form = $(form);
      wpcf7.setStatus($form, "init");
      $form.submit(function (event) {
        if (!wpcf7.supportHtml5.placeholder) {
          $("[placeholder].placeheld", $form).each(function (i, n) {
            $(n).val("").removeClass("placeheld");
          });
        }
        if (typeof window.FormData === "function") {
          wpcf7.submit($form);
          event.preventDefault();
        }
      });
      $(".wpcf7-submit", $form).after('<span class="ajax-loader"></span>');
      wpcf7.toggleSubmit($form);
      $form.on("click", ".wpcf7-acceptance", function () {
        wpcf7.toggleSubmit($form);
      });
      $(".wpcf7-exclusive-checkbox", $form).on("click", "input:checkbox", function () {
        var name = $(this).attr("name");
        $form.find('input:checkbox[name="' + name + '"]').not(this).prop("checked", false);
      });
      $(".wpcf7-list-item.has-free-text", $form).each(function () {
        var $freetext = $(":input.wpcf7-free-text", this);
        var $wrap = $(this).closest(".wpcf7-form-control");
        if ($(":checkbox, :radio", this).is(":checked")) {
          $freetext.prop("disabled", false);
        } else {
          $freetext.prop("disabled", true);
        }
        $wrap.on("change", ":checkbox, :radio", function () {
          var $cb = $(".has-free-text", $wrap).find(":checkbox, :radio");
          if ($cb.is(":checked")) {
            $freetext.prop("disabled", false).focus();
          } else {
            $freetext.prop("disabled", true);
          }
        });
      });
      if (!wpcf7.supportHtml5.placeholder) {
        $("[placeholder]", $form).each(function () {
          $(this).val($(this).attr("placeholder"));
          $(this).addClass("placeheld");
          $(this).focus(function () {
            if ($(this).hasClass("placeheld")) {
              $(this).val("").removeClass("placeheld");
            }
          });
          $(this).blur(function () {
            if ("" === $(this).val()) {
              $(this).val($(this).attr("placeholder"));
              $(this).addClass("placeheld");
            }
          });
        });
      }
      if (wpcf7.jqueryUi && !wpcf7.supportHtml5.date) {
        $form.find('input.wpcf7-date[type="date"]').each(function () {
          $(this).datepicker({dateFormat: "yy-mm-dd", minDate: new Date($(this).attr("min")), maxDate: new Date($(this).attr("max"))});
        });
      }
      if (wpcf7.jqueryUi && !wpcf7.supportHtml5.number) {
        $form.find('input.wpcf7-number[type="number"]').each(function () {
          $(this).spinner({min: $(this).attr("min"), max: $(this).attr("max"), step: $(this).attr("step")});
        });
      }
      wpcf7.resetCounter($form);
      $form.on("change", ".wpcf7-validates-as-url", function () {
        var val = $.trim($(this).val());
        if (val && !val.match(/^[a-z][a-z0-9.+-]*:/i) && -1 !== val.indexOf(".")) {
          val = val.replace(/^\/+/, "");
          val = "http://" + val;
        }
        $(this).val(val);
      });
    };
    wpcf7.submit = function (form) {
      if (typeof window.FormData !== "function") {
        return;
      }
      var $form = $(form);
      $(".ajax-loader", $form).addClass("is-active");
      wpcf7.clearResponse($form);
      var formData = new FormData($form.get(0));
      var detail = {id: $form.closest("div.wpcf7").attr("id"), status: "init", inputs: [], formData: formData};
      $.each($form.serializeArray(), function (i, field) {
        if ("_wpcf7" == field.name) {
          detail.contactFormId = field.value;
        } else if ("_wpcf7_version" == field.name) {
          detail.pluginVersion = field.value;
        } else if ("_wpcf7_locale" == field.name) {
          detail.contactFormLocale = field.value;
        } else if ("_wpcf7_unit_tag" == field.name) {
          detail.unitTag = field.value;
        } else if ("_wpcf7_container_post" == field.name) {
          detail.containerPostId = field.value;
        } else if (field.name.match(/^_/)) {} else {
          detail.inputs.push(field);
        }
      });
      wpcf7.triggerEvent($form.closest("div.wpcf7"), "beforesubmit", detail);
      var ajaxSuccess = function (data, status, xhr, $form) {
        detail.id = $(data.into).attr("id");
        detail.status = data.status;
        detail.apiResponse = data;
        switch (data.status) {
          case "init":
            wpcf7.setStatus($form, "init");
            break;
          case "validation_failed":
            $.each(data.invalid_fields, function (i, n) {
              $(n.into, $form).each(function () {
                wpcf7.notValidTip(this, n.message);
                $(".wpcf7-form-control", this).addClass("wpcf7-not-valid");
                $("[aria-invalid]", this).attr("aria-invalid", "true");
              });
            });
            wpcf7.setStatus($form, "invalid");
            wpcf7.triggerEvent(data.into, "invalid", detail);
            break;
          case "acceptance_missing":
            wpcf7.setStatus($form, "unaccepted");
            wpcf7.triggerEvent(data.into, "unaccepted", detail);
            break;
          case "spam":
            wpcf7.setStatus($form, "spam");
            wpcf7.triggerEvent(data.into, "spam", detail);
            break;
          case "aborted":
            wpcf7.setStatus($form, "aborted");
            wpcf7.triggerEvent(data.into, "aborted", detail);
            break;
          case "mail_sent":
            wpcf7.setStatus($form, "sent");
            wpcf7.triggerEvent(data.into, "mailsent", detail);
            break;
          case "mail_failed":
            wpcf7.setStatus($form, "failed");
            wpcf7.triggerEvent(data.into, "mailfailed", detail);
            break;
          default:
            wpcf7.setStatus($form, "custom-" + data.status.replace(/[^0-9a-z]+/i, "-"));
        }
        wpcf7.refill($form, data);
        wpcf7.triggerEvent(data.into, "submit", detail);
        if ("mail_sent" == data.status) {
          $form.each(function () {
            this.reset();
          });
          wpcf7.toggleSubmit($form);
          wpcf7.resetCounter($form);
        }
        if (!wpcf7.supportHtml5.placeholder) {
          $form.find("[placeholder].placeheld").each(function (i, n) {
            $(n).val($(n).attr("placeholder"));
          });
        }
        $(".wpcf7-response-output", $form).html("").append(data.message).slideDown("fast");
        $(".screen-reader-response", $form.closest(".wpcf7")).each(function () {
          var $response = $(this);
          $response.html("").append(data.message);
          if (data.invalid_fields) {
            var $invalids = $("<ul></ul>");
            $.each(data.invalid_fields, function (i, n) {
              if (n.idref) {
                var $li = $("<li></li>").append($("<a></a>").attr("href", "#" + n.idref).append(n.message));
              } else {
                var $li = $("<li></li>").append(n.message);
              }
              $invalids.append($li);
            });
            $response.append($invalids);
          }
          $response.focus();
        });
        if (data.posted_data_hash) {
          $form.find('input[name="_wpcf7_posted_data_hash"]').first().val(data.posted_data_hash);
        }
      };
      $.ajax({type: "POST", url: wpcf7.apiSettings.getRoute("/contact-forms/" + wpcf7.getId($form) + "/feedback"), data: formData, dataType: "json", processData: false, contentType: false}).done(function (data, status, xhr) {
        ajaxSuccess(data, status, xhr, $form);
        $(".ajax-loader", $form).removeClass("is-active");
      }).fail(function (xhr, status, error) {
        var $e = $('<div class="ajax-error"></div>').text(error.message);
        $form.after($e);
      });
    };
    wpcf7.triggerEvent = function (target, name, detail) {
      var event = new CustomEvent("wpcf7" + name, {bubbles: true, detail: detail});
      $(target).get(0).dispatchEvent(event);
    };
    wpcf7.setStatus = function (form, status) {
      var $form = $(form);
      var prevStatus = $form.data("status");
      $form.data("status", status);
      $form.addClass(status);
      if (prevStatus && prevStatus !== status) {
        $form.removeClass(prevStatus);
      }
    };
    wpcf7.toggleSubmit = function (form, state) {
      var $form = $(form);
      var $submit = $("input:submit", $form);
      if (typeof state !== "undefined") {
        $submit.prop("disabled", !state);
        return;
      }
      if ($form.hasClass("wpcf7-acceptance-as-validation")) {
        return;
      }
      $submit.prop("disabled", false);
      $(".wpcf7-acceptance", $form).each(function () {
        var $span = $(this);
        var $input = $("input:checkbox", $span);
        if (!$span.hasClass("optional")) {
          if ($span.hasClass("invert") && $input.is(":checked") || !$span.hasClass("invert") && !$input.is(":checked")) {
            $submit.prop("disabled", true);
            return false;
          }
        }
      });
    };
    wpcf7.resetCounter = function (form) {
      var $form = $(form);
      $(".wpcf7-character-count", $form).each(function () {
        var $count = $(this);
        var name = $count.attr("data-target-name");
        var down = $count.hasClass("down");
        var starting = parseInt($count.attr("data-starting-value"), 10);
        var maximum = parseInt($count.attr("data-maximum-value"), 10);
        var minimum = parseInt($count.attr("data-minimum-value"), 10);
        var updateCount = function (target) {
          var $target = $(target);
          var length = $target.val().length;
          var count = down ? starting - length : length;
          $count.attr("data-current-value", count);
          $count.text(count);
          if (maximum && maximum < length) {
            $count.addClass("too-long");
          } else {
            $count.removeClass("too-long");
          }
          if (minimum && length < minimum) {
            $count.addClass("too-short");
          } else {
            $count.removeClass("too-short");
          }
        };
        $(':input[name="' + name + '"]', $form).each(function () {
          updateCount(this);
          $(this).keyup(function () {
            updateCount(this);
          });
        });
      });
    };
    wpcf7.notValidTip = function (target, message) {
      var $target = $(target);
      $(".wpcf7-not-valid-tip", $target).remove();
      $("<span></span>").attr({class: "wpcf7-not-valid-tip", role: "alert", "aria-hidden": "true"}).text(message).appendTo($target);
      if ($target.is(".use-floating-validation-tip *")) {
        var fadeOut = function (target) {
          $(target).not(":hidden").animate({opacity: 0}, "fast", function () {
            $(this).css({"z-index": -100});
          });
        };
        $target.on("mouseover", ".wpcf7-not-valid-tip", function () {
          fadeOut(this);
        });
        $target.on("focus", ":input", function () {
          fadeOut($(".wpcf7-not-valid-tip", $target));
        });
      }
    };
    wpcf7.refill = function (form, data) {
      var $form = $(form);
      var refillCaptcha = function ($form, items) {
        $.each(items, function (i, n) {
          $form.find(':input[name="' + i + '"]').val("");
          $form.find("img.wpcf7-captcha-" + i).attr("src", n);
          var match = /([0-9]+)\.(png|gif|jpeg)$/.exec(n);
          $form.find('input:hidden[name="_wpcf7_captcha_challenge_' + i + '"]').attr("value", match[1]);
        });
      };
      var refillQuiz = function ($form, items) {
        $.each(items, function (i, n) {
          $form.find(':input[name="' + i + '"]').val("");
          $form.find(':input[name="' + i + '"]').siblings("span.wpcf7-quiz-label").text(n[0]);
          $form.find('input:hidden[name="_wpcf7_quiz_answer_' + i + '"]').attr("value", n[1]);
        });
      };
      if (typeof data === "undefined") {
        $.ajax({type: "GET", url: wpcf7.apiSettings.getRoute("/contact-forms/" + wpcf7.getId($form) + "/refill"), beforeSend: function (xhr) {
          var nonce = $form.find(':input[name="_wpnonce"]').val();
          if (nonce) {
            xhr.setRequestHeader("X-WP-Nonce", nonce);
          }
        }, dataType: "json"}).done(function (data, status, xhr) {
          if (data.captcha) {
            refillCaptcha($form, data.captcha);
          }
          if (data.quiz) {
            refillQuiz($form, data.quiz);
          }
        });
      } else {
        if (data.captcha) {
          refillCaptcha($form, data.captcha);
        }
        if (data.quiz) {
          refillQuiz($form, data.quiz);
        }
      }
    };
    wpcf7.clearResponse = function (form) {
      var $form = $(form);
      $form.siblings(".screen-reader-response").html("");
      $(".wpcf7-not-valid-tip", $form).remove();
      $("[aria-invalid]", $form).attr("aria-invalid", "false");
      $(".wpcf7-form-control", $form).removeClass("wpcf7-not-valid");
      $(".wpcf7-response-output", $form).hide().empty();
    };
    wpcf7.apiSettings.getRoute = function (path) {
      var url = wpcf7.apiSettings.root;
      url = url.replace(wpcf7.apiSettings.namespace, wpcf7.apiSettings.namespace + path);
      return url;
    };
  }(jQuery));
  (function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
      params = params || {bubbles: false, cancelable: false, detail: undefined};
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }());
} catch (e) {}
try {
  !function (e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, true) : function (e) {
      if (!e.document) throw new Error("jQuery requires a window with a document");
      return t(e);
    } : t(e);
  }("undefined" != typeof window ? window : this, function (C, e) {
    "use strict";
    var t = [], r = Object.getPrototypeOf, s = t.slice, v = t.flat ? function (e) {
      return t.flat.call(e);
    } : function (e) {
      return t.concat.apply([], e);
    }, u = t.push, i = t.indexOf, n = {}, o = n.toString, y = n.hasOwnProperty, a = y.toString, l = a.call(Object), m = {}, E = C.document, c = {type: true, src: true, nonce: true, noModule: true};
    function b(e, t, n) {
      var r, i, o = (n = n || E).createElement("script");
      if (o.text = e, t) for (r in c) (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
      n.head.appendChild(o).parentNode.removeChild(o);
    }
    function w(e) {
      return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[o.call(e)] || "object" : typeof e;
    }
    var f = "3.5.1", S = function (e, t) {
      return new S.fn.init(e, t);
    };
    function p(e) {
      var t = !!e && "length" in e && e.length, n = w(e);
      return !("function" == typeof e && "number" != typeof e.nodeType) && !(null != e && e === e.window) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e);
    }
    S.fn = S.prototype = {jquery: f, constructor: S, length: 0, toArray: function () {
      return s.call(this);
    }, get: function (e) {
      return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e];
    }, pushStack: function (e) {
      var t = S.merge(this.constructor(), e);
      return t.prevObject = this, t;
    }, each: function (e) {
      return S.each(this, e);
    }, map: function (n) {
      return this.pushStack(S.map(this, function (e, t) {
        return n.call(e, t, e);
      }));
    }, slice: function () {
      return this.pushStack(s.apply(this, arguments));
    }, first: function () {
      return this.eq(0);
    }, last: function () {
      return this.eq(-1);
    }, even: function () {
      return this.pushStack(S.grep(this, function (e, t) {
        return (t + 1) % 2;
      }));
    }, odd: function () {
      return this.pushStack(S.grep(this, function (e, t) {
        return t % 2;
      }));
    }, eq: function (e) {
      var t = this.length, n = +e + (e < 0 ? t : 0);
      return this.pushStack(0 <= n && n < t ? [this[n]] : []);
    }, end: function () {
      return this.prevObject || this.constructor();
    }, push: u, sort: t.sort, splice: t.splice}, S.extend = S.fn.extend = function () {
      var e, t, n, r, i, o, a = arguments[0] || {}, s = 1, u = arguments.length, l = false;
      for ("boolean" == typeof a && (l = a, a = arguments[s] || {}, s++), "object" == typeof a || "function" == typeof a && "number" != typeof a.nodeType || (a = {}), s === u && (a = this, s--); s < u; s++) if (null != (e = arguments[s])) for (t in e) r = e[t], "__proto__" !== t && a !== r && (l && r && (S.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t], o = i && !Array.isArray(n) ? [] : i || S.isPlainObject(n) ? n : {}, i = false, a[t] = S.extend(l, o, r)) : void 0 !== r && (a[t] = r));
      return a;
    }, S.extend({expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""), isReady: true, error: function (e) {
      throw new Error(e);
    }, noop: function () {}, isPlainObject: function (e) {
      var t, n;
      return !(!e || "[object Object]" !== o.call(e)) && (!(t = r(e)) || "function" == typeof (n = y.call(t, "constructor") && t.constructor) && a.call(n) === l);
    }, isEmptyObject: function (e) {
      var t;
      for (t in e) return false;
      return true;
    }, globalEval: function (e, t, n) {
      b(e, {nonce: t && t.nonce}, n);
    }, each: function (e, t) {
      var n, r = 0;
      if (p(e)) for (n = e.length; r < n && false !== t.call(e[r], r, e[r]); r++) ; else for (r in e) if (false === t.call(e[r], r, e[r])) break;
      return e;
    }, makeArray: function (e, t) {
      var n = t || [];
      return null != e && (p(Object(e)) ? S.merge(n, "string" == typeof e ? [e] : e) : u.call(n, e)), n;
    }, inArray: function (e, t, n) {
      return null == t ? -1 : i.call(t, e, n);
    }, merge: function (e, t) {
      for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
      return e.length = i, e;
    }, grep: function (e, t, n) {
      for (var r = [], i = 0, o = e.length, a = !n; i < o; i++) !t(e[i], i) != a && r.push(e[i]);
      return r;
    }, map: function (e, t, n) {
      var r, i, o = 0, a = [];
      if (p(e)) for (r = e.length; o < r; o++) null != (i = t(e[o], o, n)) && a.push(i); else for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
      return v(a);
    }, guid: 1, support: m}), "function" == typeof Symbol && (S.fn[Symbol.iterator] = t[Symbol.iterator]), S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
      n["[object " + t + "]"] = t.toLowerCase();
    });
    var d = function (n) {
      function f(e, t) {
        var n = "0x" + e.slice(1) - 65536;
        return t || (n < 0 ? String.fromCharCode(65536 + n) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320));
      }
      function i() {
        T();
      }
      var e, d, b, o, a, h, p, g, w, u, l, T, C, s, E, v, c, y, m, S = "sizzle" + +new Date, x = n.document, k = 0, r = 0, A = ue(), N = ue(), D = ue(), j = ue(), L = {}.hasOwnProperty, t = [], H = t.pop, O = t.push, P = t.push, R = t.slice, M = function (e, t) {
        for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
        return -1;
      }, I = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", W = "[\\x20\\t\\r\\n\\f]", F = "(?:\\\\[\\da-fA-F]{1,6}" + W + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^-\\x7f])+", B = "\\[" + W + "*(" + F + ")(?:" + W + "*([*^$|!~]?=)" + W + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + F + "))|)" + W + "*\\]", $ = ":(" + F + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + B + ")*)|.*)\\)|)", _ = new RegExp(W + "+", "g"), z = new RegExp("^" + W + "+|((?:^|[^\\\\])(?:\\\\.)*)" + W + "+$", "g"), U = new RegExp("^" + W + "*," + W + "*"), X = new RegExp("^" + W + "*([>+~]|" + W + ")" + W + "*"), V = new RegExp(W + "|>"), G = new RegExp($), Y = new RegExp("^" + F + "$"), Q = {ID: new RegExp("^#(" + F + ")"), CLASS: new RegExp("^\\.(" + F + ")"), TAG: new RegExp("^(" + F + "|[*])"), ATTR: new RegExp("^" + B), PSEUDO: new RegExp("^" + $), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + W + "*(even|odd|(([+-]|)(\\d*)n|)" + W + "*(?:([+-]|)" + W + "*(\\d+)|))" + W + "*\\)|)", "i"), bool: new RegExp("^(?:" + I + ")$", "i"), needsContext: new RegExp("^" + W + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + W + "*((?:-\\d)?\\d*)" + W + "*\\)|)(?=[^-]|$)", "i")}, J = /HTML$/i, K = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, ee = /^[^{]+\{\s*\[native \w/, te = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ne = /[+~]/, re = new RegExp("\\\\[\\da-fA-F]{1,6}" + W + "?|\\\\([^\\r\\n\\f])", "g"), ie = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, oe = function (e, t) {
        return t ? "" === e ? "ï¿½" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e;
      }, ae = me(function (e) {
        return true === e.disabled && "fieldset" === e.nodeName.toLowerCase();
      }, {dir: "parentNode", next: "legend"});
      try {
        P.apply(t = R.call(x.childNodes), x.childNodes), t[x.childNodes.length].nodeType;
      } catch (e) {
        P = {apply: t.length ? function (e, t) {
          O.apply(e, R.call(t));
        } : function (e, t) {
          for (var n = e.length, r = 0; e[n++] = t[r++];) ;
          e.length = n - 1;
        }};
      }
      function se(t, e, n, r) {
        var i, o, a, s, u, l, c, f = e && e.ownerDocument, p = e ? e.nodeType : 9;
        if (n = n || [], "string" != typeof t || !t || 1 !== p && 9 !== p && 11 !== p) return n;
        if (!r && (T(e), e = e || C, E)) {
          if (11 !== p && (u = te.exec(t))) if (i = u[1]) {
            if (9 === p) {
              if (!(a = e.getElementById(i))) return n;
              if (a.id === i) return n.push(a), n;
            } else if (f && (a = f.getElementById(i)) && m(e, a) && a.id === i) return n.push(a), n;
          } else {
            if (u[2]) return P.apply(n, e.getElementsByTagName(t)), n;
            if ((i = u[3]) && d.getElementsByClassName && e.getElementsByClassName) return P.apply(n, e.getElementsByClassName(i)), n;
          }
          if (d.qsa && !j[t + " "] && (!v || !v.test(t)) && (1 !== p || "object" !== e.nodeName.toLowerCase())) {
            if (c = t, f = e, 1 === p && (V.test(t) || X.test(t))) {
              for ((f = ne.test(t) && (e.parentNode && void 0 !== e.parentNode.getElementsByTagName && e.parentNode) || e) === e && d.scope || ((s = e.getAttribute("id")) ? s = s.replace(ie, oe) : e.setAttribute("id", s = S)), o = (l = h(t)).length; o--;) l[o] = (s ? "#" + s : ":scope") + " " + ye(l[o]);
              c = l.join(",");
            }
            try {
              return P.apply(n, f.querySelectorAll(c)), n;
            } catch (e) {
              j(t, true);
            } finally {
              s === S && e.removeAttribute("id");
            }
          }
        }
        return null != t.replace(z, "$1") && t.replace(z, "$1") === t.replace(z, "$1").window;
      }
      function ue() {
        var n = [];
        return r;
      }
      function ce(e) {
        var t = C.createElement("fieldset");
        try {
          return !!e(t);
        } catch (e) {
          return false;
        } finally {
          t.parentNode && t.parentNode.removeChild(t), t = null;
        }
      }
      function fe(e, t) {
        for (var n = e.split("|"), r = n.length; r--;) b.attrHandle[n[r]] = t;
      }
      function pe(e, t) {
        var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
        if (r) return r;
        if (n) for (; n = n.nextSibling;) if (n === t) return -1;
        return e ? 1 : -1;
      }
      function de(t) {
        return function (e) {
          return "form" in e ? e.parentNode && false === e.disabled ? "label" in e ? "label" in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ("none" === (e = t || e).style.display || "" === e.style.display && S.contains(e.ownerDocument, e) && "none" === S.css(e, "display")) === t : e.disabled === t : "label" in e && e.disabled === t;
        };
      }
      function he(a) {
        return function (o) {
          return o = +o, (function (e, t) {
            for (var n, r = a([], e.length, o), i = r.length; i--;) e[n = r[i]] && (e[n] = !(t[n] = e[n]));
          }[S] = true, function (e, t) {
            for (var n, r = a([], e.length, o), i = r.length; i--;) e[n = r[i]] && (e[n] = !(t[n] = e[n]));
          });
        }[S] = true, function (o) {
          return o = +o, (function (e, t) {
            for (var n, r = a([], e.length, o), i = r.length; i--;) e[n = r[i]] && (e[n] = !(t[n] = e[n]));
          }[S] = true, function (e, t) {
            for (var n, r = a([], e.length, o), i = r.length; i--;) e[n = r[i]] && (e[n] = !(t[n] = e[n]));
          });
        };
      }
      for (e in d = se.support = {}, a = se.isXML = function (e) {
        var t = e.namespaceURI, n = (e.ownerDocument || e).documentElement;
        return !J.test(t || n && n.nodeName || "HTML");
      }, T = se.setDocument = function (e) {
        var t, n, r = e ? e.ownerDocument || e : x;
        return r != C && 9 === r.nodeType && r.documentElement && (s = (C = r).documentElement, E = !a(C), x != C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", i, false) : n.attachEvent && n.attachEvent("onunload", i)), d.scope = ce(function (e) {
          return s.appendChild(e).appendChild(C.createElement("div")), void 0 !== e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length;
        }), d.attributes = ce(function (e) {
          return e.className = "i", !e.getAttribute("className");
        }), d.getElementsByTagName = ce(function (e) {
          return e.appendChild(C.createComment("")), !e.getElementsByTagName("*").length;
        }), d.getElementsByClassName = ee.test(C.getElementsByClassName), d.getById = ce(function (e) {
          return s.appendChild(e).id = S, !C.getElementsByName || !C.getElementsByName(S).length;
        }), d.getById ? (b.filter.ID = function (e) {
          var t = e.replace(re, f);
          return function (e) {
            return e.getAttribute("id") === t;
          };
        }, b.find.ID = function (e, t) {
          if (void 0 !== t.getElementById && E) {
            var n = t.getElementById(e);
            return n ? [n] : [];
          }
        }) : (b.filter.ID = function (e) {
          var n = e.replace(re, f);
          return function (e) {
            var t = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
            return t && t.value === n;
          };
        }, b.find.ID = function (e, t) {
          if (void 0 !== t.getElementById && E) {
            var n, r, i, o = t.getElementById(e);
            if (o) {
              if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
              for (i = t.getElementsByName(e), r = 0; o = i[r++];) if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
            }
            return [];
          }
        }), b.find.TAG = d.getElementsByTagName ? function (e, t) {
          return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : d.qsa ? t.querySelectorAll(e) : void 0;
        } : function (e, t) {
          var n, r = [], i = 0, o = t.getElementsByTagName(e);
          if ("*" !== e) return o;
          for (; n = o[i++];) 1 === n.nodeType && r.push(n);
          return r;
        }, b.find.CLASS = d.getElementsByClassName && function (e, t) {
          if (void 0 !== t.getElementsByClassName && E) return t.getElementsByClassName(e);
        }, c = [], v = [], (d.qsa = ee.test(C.querySelectorAll)) && (ce(function (e) {
          var t;
          s.appendChild(e).innerHTML = "<a id='" + S + "'></a><select id='" + S + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + W + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || v.push("\\[" + W + "*(?:value|" + I + ")"), e.querySelectorAll("[id~=" + S + "-]").length || v.push("~="), (t = C.createElement("input")).setAttribute("name", ""), e.appendChild(t), e.querySelectorAll("[name='']").length || v.push("\\[" + W + "*name" + W + "*=" + W + "*(?:''|\"\")"), e.querySelectorAll(":checked").length || v.push(":checked"), e.querySelectorAll("a#" + S + "+*").length || v.push(".#.+[+~]"), e.querySelectorAll("\\"), v.push("[\\r\\n\\f]");
        }), ce(function (e) {
          e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
          var t = C.createElement("input");
          t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && v.push("name" + W + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"), s.appendChild(e).disabled = true, 2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), v.push(",.*:");
        })), (d.matchesSelector = ee.test(y = s.matches || s.webkitMatchesSelector || s.mozMatchesSelector || s.oMatchesSelector || s.msMatchesSelector)) && ce(function (e) {
          d.disconnectedMatch = y.call(e, "*"), y.call(e, "[s!='']:x"), c.push("!=", $);
        }), v = v.length && new RegExp(v.join("|")), c = c.length && new RegExp(c.join("|")), t = ee.test(s.compareDocumentPosition), m = t || ee.test(s.contains) ? function (e, t) {
          var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
          return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
        } : function (e, t) {
          if (t) for (; t = t.parentNode;) if (t === e) return true;
          return false;
        }, q = t ? function (e, t) {
          if (e === t) return l = true, 0;
          var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
          return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !d.sortDetached && t.compareDocumentPosition(e) === n ? e == C || e.ownerDocument == x && m(x, e) ? -1 : t == C || t.ownerDocument == x && m(x, t) ? 1 : u ? M(u, e) - M(u, t) : 0 : 4 & n ? -1 : 1);
        } : function (e, t) {
          if (e === t) return l = true, 0;
          var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
          if (!i || !o) return e == C ? -1 : t == C ? 1 : i ? -1 : o ? 1 : u ? M(u, e) - M(u, t) : 0;
          if (i === o) return pe(e, t);
          for (n = e; n = n.parentNode;) a.unshift(n);
          for (n = t; n = n.parentNode;) s.unshift(n);
          for (; a[r] === s[r];) r++;
          return r ? pe(a[r], s[r]) : a[r] == x ? -1 : s[r] == x ? 1 : 0;
        }), C;
      }, se.matches = function (e, t) {
        return se(e, null, null, t);
      }, se.matchesSelector = function (e, t) {
        if (T(e), d.matchesSelector && E && !j[t + " "] && (!c || !c.test(t)) && (!v || !v.test(t))) try {
          var n = y.call(e, t);
          if (n || d.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n;
        } catch (e) {
          j(t, true);
        }
        return 0 < se(t, C, null, [e]).length;
      }, se.contains = function (e, t) {
        return (e.ownerDocument || e) != C && T(e), m(e, t);
      }, se.attr = function (e, t) {
        (e.ownerDocument || e) != C && T(e);
        var n = b.attrHandle[t.toLowerCase()], r = n && L.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
        return void 0 !== r ? r : d.attributes || !E ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
      }, se.escape = function (e) {
        return (e + "").replace(ie, oe);
      }, se.error = function (e) {
        throw new Error("Syntax error, unrecognized expression: " + e);
      }, se.uniqueSort = function (e) {
        var t, n = [], r = 0, i = 0;
        if (l = !d.detectDuplicates, u = !d.sortStable && e.slice(0), e.sort(q), l) {
          for (; t = e[i++];) t === e[i] && (r = n.push(i));
          for (; r--;) e.splice(n[r], 1);
        }
        return u = null, e;
      }, o = se.getText = function (e) {
        var t, n = "", r = 0, i = e.nodeType;
        if (i) {
          if (1 === i || 9 === i || 11 === i) {
            if ("string" == typeof e.textContent) return e.textContent;
            for (e = e.firstChild; e; e = e.nextSibling) n += o(e);
          } else if (3 === i || 4 === i) return e.nodeValue;
        } else for (; t = e[r++];) n += o(t);
        return n;
      }, (b = se.selectors = {cacheLength: 50, createPseudo: le, match: Q, attrHandle: {}, find: {}, relative: {">": {dir: "parentNode", first: true}, " ": {dir: "parentNode"}, "+": {dir: "previousSibling", first: true}, "~": {dir: "previousSibling"}}, preFilter: {ATTR: function (e) {
        return e[1] = e[1].replace(re, f), e[3] = (e[3] || e[4] || e[5] || "").replace(re, f), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
      }, CHILD: function (e) {
        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]), e;
      }, PSEUDO: function (e) {
        var t, n = !e[6] && e[2];
        return Q.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && G.test(n) && (t = h(n, true)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3));
      }}, filter: {TAG: function (e) {
        var t = e.replace(re, f).toLowerCase();
        return "*" === e ? function () {
          return true;
        } : function (e) {
          return e.nodeName && e.nodeName.toLowerCase() === t;
        };
      }, CLASS: function (e) {
        var t = A[e + " "];
        return t || (t = new RegExp("(^|" + W + ")" + e + "(" + W + "|$)")) && (e.nodeName && e.nodeName.toLowerCase() === function (e) {
          return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "");
        }.toLowerCase());
      }, ATTR: function (n, r, i) {
        return function (e) {
          var t = se.attr(e, n);
          return null == t ? "!=" === r : !r || (t += "", "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(_, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"));
        };
      }, CHILD: function (h, e, t, g, v) {
        var y = "nth" !== h.slice(0, 3), m = "last" !== h.slice(-4), x = "of-type" === e;
        return 1 === g && 0 === v ? function (e) {
          return !!e.parentNode;
        } : function (e, t, n) {
          var r, i, o, a, s, u, l = y != m ? "nextSibling" : "previousSibling", c = e.parentNode, f = x && e.nodeName.toLowerCase(), p = !n && !x, d = false;
          if (c) {
            if (y) {
              for (; l;) {
                for (a = e; a = a[l];) if (x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) return false;
                u = l = "only" === h && !u && "nextSibling";
              }
              return true;
            }
            if (u = [m ? c.firstChild : c.lastChild], m && p) {
              for (d = (s = (r = (i = (o = (a = c)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]) && r[2], a = s && c.childNodes[s]; a = ++s && a && a[l] || (d = s = 0) || u.pop();) if (1 === a.nodeType && ++d && a === e) {
                i[h] = [k, s, d];
                break;
              }
            } else if (p && (d = s = (r = (i = (o = (a = e)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]), false === d) for (; (a = ++s && a && a[l] || (d = s = 0) || u.pop()) && ((x ? a.nodeName.toLowerCase() !== f : 1 !== a.nodeType) || !++d || (p && ((i = (o = a[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [k, d]), a !== e));) ;
            return (d -= v) === g || d % g == 0 && 0 <= d / g;
          }
        };
      }, PSEUDO: function (e, o) {
        var t, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
        return a[S] ? a(o) : 1 < a.length ? (t = [e, e, "", o], b.setFilters.hasOwnProperty(e.toLowerCase()) ? (function (e, t) {
          for (var n, r = a(e, o), i = r.length; i--;) e[n = M(e, r[i])] = !(t[n] = r[i]);
        }[S] = true, function (e, t) {
          for (var n, r = a(e, o), i = r.length; i--;) e[n = M(e, r[i])] = !(t[n] = r[i]);
        }) : function (e) {
          return a(e, 0, t);
        }) : a;
      }}, pseudos: {not: (function (e) {
        var r = [], i = [], s = p(e.replace(z, "$1"));
        return s[S] ? (function (e, t, n, r) {
          for (var i, o = s(e, null, r, []), a = e.length; a--;) (i = o[a]) && (e[a] = !(t[a] = i));
        }[S] = true, function (e, t, n, r) {
          for (var i, o = s(e, null, r, []), a = e.length; a--;) (i = o[a]) && (e[a] = !(t[a] = i));
        }) : function (e, t, n) {
          return r[0] = e, s(r, null, n, i), r[0] = null, !i.pop();
        };
      }[S] = true, function (e) {
        var r = [], i = [], s = p(e.replace(z, "$1"));
        return s[S] ? (function (e, t, n, r) {
          for (var i, o = s(e, null, r, []), a = e.length; a--;) (i = o[a]) && (e[a] = !(t[a] = i));
        }[S] = true, function (e, t, n, r) {
          for (var i, o = s(e, null, r, []), a = e.length; a--;) (i = o[a]) && (e[a] = !(t[a] = i));
        }) : function (e, t, n) {
          return r[0] = e, s(r, null, n, i), r[0] = null, !i.pop();
        };
      }), has: (function (t) {
        return function (e) {
          return 0 < se(t, e).length;
        };
      }[S] = true, function (t) {
        return function (e) {
          return 0 < se(t, e).length;
        };
      }), contains: (function (t) {
        return t = t.replace(re, f), function (e) {
          return -1 < (e.textContent || o(e)).indexOf(t);
        };
      }[S] = true, function (t) {
        return t = t.replace(re, f), function (e) {
          return -1 < (e.textContent || o(e)).indexOf(t);
        };
      }), lang: (function (n) {
        return Y.test(n || "") || se.error("unsupported lang: " + n), n = n.replace(re, f).toLowerCase(), function (e) {
          var t;
          do {
            if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-");
          } while ((e = e.parentNode) && 1 === e.nodeType);
          return false;
        };
      }[S] = true, function (n) {
        return Y.test(n || "") || se.error("unsupported lang: " + n), n = n.replace(re, f).toLowerCase(), function (e) {
          var t;
          do {
            if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-");
          } while ((e = e.parentNode) && 1 === e.nodeType);
          return false;
        };
      }), target: function (e) {
        var t = n.location && n.location.hash;
        return t && t.slice(1) === e.id;
      }, root: function (e) {
        return e === s;
      }, focus: function (e) {
        return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
      }, enabled: de(false), disabled: de(true), checked: function (e) {
        var t = e.nodeName.toLowerCase();
        return "input" === t && !!e.checked || "option" === t && !!e.selected;
      }, selected: function (e) {
        return e.parentNode && e.parentNode.selectedIndex, true === e.selected;
      }, empty: function (e) {
        for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeType < 6) return false;
        return true;
      }, parent: function (e) {
        return !b.pseudos.empty(e);
      }, header: function (e) {
        return Z.test(e.nodeName);
      }, input: function (e) {
        return K.test(e.nodeName);
      }, button: function (e) {
        var t = e.nodeName.toLowerCase();
        return "input" === t && "button" === e.type || "button" === t;
      }, text: function (e) {
        var t;
        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase());
      }, first: he(function () {
        return [0];
      }), last: he(function (e, t) {
        return [t - 1];
      }), eq: he(function (e, t, n) {
        return [n < 0 ? n + t : n];
      }), even: he(function (e, t) {
        for (var n = 0; n < t; n += 2) e.push(n);
        return e;
      }), odd: he(function (e, t) {
        for (var n = 1; n < t; n += 2) e.push(n);
        return e;
      }), lt: he(function (e, t, n) {
        for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r;) e.push(r);
        return e;
      }), gt: he(function (e, t, n) {
        for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
        return e;
      })}}).pseudos.nth = b.pseudos.eq, {radio: true, checkbox: true, file: true, password: true, image: true}) b.pseudos[e] = function (t) {
        return function (e) {
          return "input" === e.nodeName.toLowerCase() && e.type === t;
        };
      }(e);
      for (e in {submit: true, reset: true}) b.pseudos[e] = function (n) {
        return function (e) {
          var t = e.nodeName.toLowerCase();
          return ("input" === t || "button" === t) && e.type === n;
        };
      }(e);
      function ve() {}
      function ye(e) {
        for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
        return r;
      }
      function me(s, e, t) {
        var u = e.dir, l = e.next, c = l || u, f = t && "parentNode" === c, p = r++;
        return e.first ? function (e, t, n) {
          for (; e = e[u];) if (1 === e.nodeType || f) return s(e, t, n);
          return false;
        } : function (e, t, n) {
          var r, i, o, a = [k, p];
          if (n) {
            for (; e = e[u];) if ((1 === e.nodeType || f) && s(e, t, n)) return true;
          } else for (; e = e[u];) if (1 === e.nodeType || f) if (i = (o = e[S] || (e[S] = {}))[e.uniqueID] || (o[e.uniqueID] = {}), l && l === e.nodeName.toLowerCase()) e = e[u] || e; else {
            if ((r = i[c]) && r[0] === k && r[1] === p) return a[2] = r[2];
            if ((i[c] = a)[2] = s(e, t, n)) return true;
          }
          return false;
        };
      }
      function xe(i) {
        return 1 < i.length ? function (e, t, n) {
          for (var r = i.length; r--;) if (!i[r](e, t, n)) return false;
          return true;
        } : i[0];
      }
      function be(e, t, n, r, i) {
        for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++) (o = e[s]) && (n && !n(o, r, i) || (a.push(o), l && t.push(s)));
        return a;
      }
      function we(d, h, g, v, y, e) {
        return v && !v[S] && (v = we(v)), y && !y[S] && (y = we(y, e)), (function (e, t, n, r) {
          var i, o, a, s = [], u = [], l = t.length, c = e || function (e, t, n) {
            for (var r = 0, i = t.length; r < i; r++) se(e, t[r], n);
            return n;
          }(h || "*", n.nodeType ? [n] : n, []), f = !d || !e && h ? c : be(c, s, d, n, r), p = g ? y || (e ? d : l || v) ? [] : t : f;
          if (g && (null != f && f === f.window), v) for (i = be(p, u), v(i, [], n, r), o = i.length; o--;) (a = i[o]) && (p[u[o]] = !(f[u[o]] = a));
          if (e) {
            if (y || d) {
              if (y) {
                for (i = [], o = p.length; o--;) (a = p[o]) && i.push(f[o] = a);
                y(null, p = [], i, r);
              }
              for (o = p.length; o--;) (a = p[o]) && -1 < (i = y ? M(e, a) : s[o]) && (e[i] = !(t[i] = a));
            }
          } else p = be(p === t ? p.splice(l, p.length) : p), y ? y(null, t, p, r) : P.apply(t, p);
        }[S] = true, function (e, t, n, r) {
          var i, o, a, s = [], u = [], l = t.length, c = e || function (e, t, n) {
            for (var r = 0, i = t.length; r < i; r++) se(e, t[r], n);
            return n;
          }(h || "*", n.nodeType ? [n] : n, []), f = !d || !e && h ? c : be(c, s, d, n, r), p = g ? y || (e ? d : l || v) ? [] : t : f;
          if (g && (null != f && f === f.window), v) for (i = be(p, u), v(i, [], n, r), o = i.length; o--;) (a = i[o]) && (p[u[o]] = !(f[u[o]] = a));
          if (e) {
            if (y || d) {
              if (y) {
                for (i = [], o = p.length; o--;) (a = p[o]) && i.push(f[o] = a);
                y(null, p = [], i, r);
              }
              for (o = p.length; o--;) (a = p[o]) && -1 < (i = y ? M(e, a) : s[o]) && (e[i] = !(t[i] = a));
            }
          } else p = be(p === t ? p.splice(l, p.length) : p), y ? y(null, t, p, r) : P.apply(t, p);
        });
      }
      function Te(v, y) {
        function e(e, t, n, r, i) {
          var o, a, s, u = 0, l = "0", c = e && [], f = [], p = w, d = e || x && b.find.TAG("*", i), h = k += null == p ? 1 : Math.random() || .1, g = d.length;
          for (i && (w = t == C || t || i); l !== g && null != (o = d[l]); l++) {
            if (x && o) {
              for (a = 0, t || o.ownerDocument == C || (T(o), n = !E); s = v[a++];) if (s(o, t || C, n)) {
                r.push(o);
                break;
              }
              i && (k = h);
            }
            m && ((o = !s && o) && u--, e && c.push(o));
          }
          if (u += l, m && l !== u) {
            for (a = 0; s = y[a++];) s(c, f, t, n);
            if (e) {
              if (0 < u) for (; l--;) c[l] || f[l] || (f[l] = H.call(r));
              f = be(f);
            }
            P.apply(r, f), i && !e && 0 < f.length && 1 < u + y.length && se.uniqueSort(r);
          }
          return i && (k = h, w = p), c;
        }
        var m = 0 < y.length, x = 0 < v.length;
        return m ? (e[S] = true, e) : e;
      }
      return ve.prototype = b.filters = b.pseudos, b.setFilters = new ve, h = se.tokenize = function (e, t) {
        var n, r, i, o, a, s, u, l = N[e + " "];
        if (l) return t ? 0 : l.slice(0);
        for (a = e, s = [], u = b.preFilter; a;) {
          for (o in n && !(r = U.exec(a)) || (r && (a = a.slice(r[0].length) || a), s.push(i = [])), n = false, (r = X.exec(a)) && (n = r.shift(), i.push({value: n, type: r[0].replace(z, " ")}), a = a.slice(n.length)), b.filter) !(r = Q[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(), i.push({value: n, type: o, matches: r}), a = a.slice(n.length));
          if (!n) break;
        }
        return t ? a.length : a ? se.error(e) : N(e, s).slice(0);
      }, p = se.compile = function (e, t) {
        var n, r = [], i = [], o = D[e + " "];
        if (!o) {
          for (n = (t = t || h(e)).length; n--;) (o = function e(t) {
            for (var i, n, r, o = t.length, a = b.relative[t[0].type], s = a || b.relative[" "], u = a ? 1 : 0, l = me(function (e) {
              return e === i;
            }, s, true), c = me(function (e) {
              return -1 < M(i, e);
            }, s, true), f = [function (e, t, n) {
              var r = !a && (n || t !== w) || ((i = t).nodeType ? l : c)(e, t, n);
              return i = null, r;
            }]; u < o; u++) if (n = b.relative[t[u].type]) f = [me(xe(f), n)]; else {
              if ((n = b.filter[t[u].type].apply(null, t[u].matches))[S]) {
                for (r = ++u; r < o && !b.relative[t[r].type]; r++) ;
                return we(1 < u && xe(f), 1 < u && ye(t.slice(0, u - 1).concat({value: " " === t[u - 2].type ? "*" : ""})).replace(z, "$1"), n, u < r && e(t.slice(u, r)), r < o && e(t = t.slice(r)), r < o && ye(t));
              }
              f.push(n);
            }
            return xe(f);
          }(t[n]))[S] ? r.push(o) : i.push(o);
          (o = D(e, Te(i, r))).selector = e;
        }
        return o;
      }, g = se.select = function (e, t, n, r) {
        var i, o, a, s, u, l = "function" == typeof e && e, c = !r && h(e = l.selector || e);
        if (n = n || [], 1 === c.length) {
          if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && E && b.relative[o[1].type]) {
            if (!(t = (b.find.ID(a.matches[0].replace(re, f), t) || [])[0])) return n;
            l && (t = t.parentNode), e = e.slice(o.shift().value.length);
          }
          for (i = Q.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !b.relative[s = a.type]);) if ((u = b.find[s]) && (r = u(a.matches[0].replace(re, f), ne.test(o[0].type) && (t.parentNode && void 0 !== t.parentNode.getElementsByTagName && t.parentNode) || t))) {
            if (o.splice(i, 1), !(e = r.length && ye(o))) return P.apply(n, r), n;
            break;
          }
        }
        return (l || p(e, c))(r, t, !E, n, !t || ne.test(e) && (t.parentNode && void 0 !== t.parentNode.getElementsByTagName && t.parentNode) || t), n;
      }, d.sortStable = S.split("").sort(q).join("") === S, d.detectDuplicates = !!l, T(), d.sortDetached = ce(function (e) {
        return 1 & e.compareDocumentPosition(C.createElement("fieldset"));
      }), ce(function (e) {
        return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href");
      }) || fe("type|href|height|width", function (e, t, n) {
        if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
      }), d.attributes && ce(function (e) {
        return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value");
      }) || fe("value", function (e, t, n) {
        if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue;
      }), ce(function (e) {
        return null == e.getAttribute("disabled");
      }) || fe(I, function (e, t, n) {
        var r;
        if (!n) return true === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
      }), se;
    }(C);
    S.find = d, S.expr = d.selectors, S.expr[":"] = S.expr.pseudos, S.uniqueSort = S.unique = d.uniqueSort, S.text = d.getText, S.isXMLDoc = d.isXML, S.contains = d.contains, S.escapeSelector = d.escape;
    function h(e, t, n) {
      for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType;) if (1 === e.nodeType) {
        if (i && S(e).is(n)) break;
        r.push(e);
      }
      return r;
    }
    function T(e, t) {
      for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
      return n;
    }
    var k = S.expr.match.needsContext;
    var N = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function D(e, n, r) {
      return "function" == typeof n && "number" != typeof n.nodeType ? S.grep(e, function (e, t) {
        return !!n.call(e, t, e) !== r;
      }) : n.nodeType ? S.grep(e, function (e) {
        return e === n !== r;
      }) : "string" != typeof n ? S.grep(e, function (e) {
        return -1 < i.call(n, e) !== r;
      }) : S.filter(n, e, r);
    }
    S.filter = function (e, t, n) {
      var r = t[0];
      return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? S.find.matchesSelector(r, e) ? [r] : [] : S.find.matches(e, S.grep(t, function (e) {
        return 1 === e.nodeType;
      }));
    }, S.fn.extend({find: function (e) {
      var t, n, r = this.length, i = this;
      if ("string" != typeof e) return this.pushStack(S(e).filter(function () {
        for (t = 0; t < r; t++) if (S.contains(i[t], this)) return true;
      }));
      for (n = this.pushStack([]), t = 0; t < r; t++) S.find(e, i[t], n);
      return 1 < r ? S.uniqueSort(n) : n;
    }, filter: function (e) {
      return this.pushStack(D(this, e || [], false));
    }, not: function (e) {
      return this.pushStack(D(this, e || [], true));
    }, is: function (e) {
      return !!D(this, "string" == typeof e && k.test(e) ? S(e) : e || [], false).length;
    }});
    var j, q = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (S.fn.init = function (e, t, n) {
      var r, i;
      if (!e) return this;
      if (n = n || j, "string" != typeof e) return e.nodeType ? (this[0] = e, this.length = 1, this) : "function" == typeof e && "number" != typeof e.nodeType ? void 0 !== n.ready ? n.ready(e) : e(S) : S.makeArray(e, this);
      if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : q.exec(e)) || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
      if (r[1]) {
        if (t = t instanceof S ? t[0] : t, S.merge(this, S.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, true)), N.test(r[1]) && S.isPlainObject(t)) for (r in t) "function" == typeof this[r] && "number" != typeof this[r].nodeType ? this[r](t[r]) : this.attr(r, t[r]);
        return this;
      }
      return (i = E.getElementById(r[2])) && (this[0] = i, this.length = 1), this;
    }).prototype = S.fn, j = S(E);
    var L = /^(?:parents|prev(?:Until|All))/, H = {children: true, contents: true, next: true, prev: true};
    function O(e, t) {
      for (; (e = e[t]) && 1 !== e.nodeType;) ;
      return e;
    }
    S.fn.extend({has: function (e) {
      var t = S(e, this), n = t.length;
      return this.filter(function () {
        for (var e = 0; e < n; e++) if (S.contains(this, t[e])) return true;
      });
    }, closest: function (e, t) {
      var n, r = 0, i = this.length, o = [], a = "string" != typeof e && S(e);
      if (!k.test(e)) for (; r < i; r++) for (n = this[r]; n && n !== t; n = n.parentNode) if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && S.find.matchesSelector(n, e))) {
        o.push(n);
        break;
      }
      return this.pushStack(1 < o.length ? S.uniqueSort(o) : o);
    }, index: function (e) {
      return e ? "string" == typeof e ? i.call(S(e), this[0]) : i.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    }, add: function (e, t) {
      return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))));
    }, addBack: function (e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }}), S.each({parent: function (e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null;
    }, parents: function (e) {
      return h(e, "parentNode");
    }, parentsUntil: function (e, t, n) {
      return h(e, "parentNode", n);
    }, next: function (e) {
      return O(e, "nextSibling");
    }, prev: function (e) {
      return O(e, "previousSibling");
    }, nextAll: function (e) {
      return h(e, "nextSibling");
    }, prevAll: function (e) {
      return h(e, "previousSibling");
    }, nextUntil: function (e, t, n) {
      return h(e, "nextSibling", n);
    }, prevUntil: function (e, t, n) {
      return h(e, "previousSibling", n);
    }, siblings: function (e) {
      return T((e.parentNode || {}).firstChild, e);
    }, children: function (e) {
      return T(e.firstChild);
    }, contents: function (e) {
      return null != e.contentDocument && r(e.contentDocument) ? e.contentDocument : (e.nodeName && e.nodeName.toLowerCase() === "template".toLowerCase() && (e = e.content || e), S.merge([], e.childNodes));
    }}, function (r, i) {
      S.fn[r] = function (e, t) {
        var n = S.map(this, i, e);
        return "Until" !== r.slice(-5) && (t = e), t && "string" == typeof t && (n = S.filter(t, n)), 1 < this.length && (H[r] || S.uniqueSort(n), L.test(r) && n.reverse()), this.pushStack(n);
      };
    });
    var P = /[^\x20\t\r\n\f]+/g;
    function M(e) {
      throw e;
    }
    function I(e, t, n, r) {
      var i;
      try {
        e && ("function" == typeof (i = e.promise) && "number" != typeof (i = e.promise).nodeType) ? i.call(e).done(t).fail(n) : e && ("function" == typeof (i = e.then) && "number" != typeof (i = e.then).nodeType) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r));
      } catch (e) {
        n.apply(void 0, [e]);
      }
    }
    S.Callbacks = function (r) {
      var e, n;
      r = "string" == typeof r ? (e = r, n = {}, S.each(e.match(P) || [], function (e, t) {
        n[t] = true;
      }), n) : S.extend({}, r);
      function i() {
        for (s = s || r.once, a = o = true; l.length; c = -1) for (t = l.shift(); ++c < u.length;) false === u[c].apply(t[0], t[1]) && r.stopOnFalse && (c = u.length, t = false);
        r.memory || (t = false), o = false, s && (u = t ? [] : "");
      }
      var o, t, a, s, u = [], l = [], c = -1, f = {add: function () {
        return u && (t && !o && (c = u.length - 1, l.push(t)), function n(e) {
          S.each(e, function (e, t) {
            "function" == typeof t && "number" != typeof t.nodeType ? r.unique && f.has(t) || u.push(t) : t && t.length && "string" !== w(t) && n(t);
          });
        }(arguments), t && !o && i()), this;
      }, remove: function () {
        return S.each(arguments, function (e, t) {
          for (var n; -1 < (n = S.inArray(t, u, n));) u.splice(n, 1), n <= c && c--;
        }), this;
      }, has: function (e) {
        return e ? -1 < S.inArray(e, u) : 0 < u.length;
      }, empty: function () {
        return u = u && [], this;
      }, disable: function () {
        return s = l = [], u = t = "", this;
      }, disabled: function () {
        return !u;
      }, lock: function () {
        return s = l = [], t || o || (u = t = ""), this;
      }, locked: function () {
        return !!s;
      }, fireWith: function (e, t) {
        return s || (t = [e, (t = t || []).slice ? t.slice() : t], l.push(t), o || i()), this;
      }, fire: function () {
        return f.fireWith(this, arguments), this;
      }, fired: function () {
        return !!a;
      }};
      return f;
    }, S.extend({Deferred: function (e) {
      var o = [["notify", "progress", S.Callbacks("memory"), S.Callbacks("memory"), 2], ["resolve", "done", S.Callbacks("once memory"), S.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", S.Callbacks("once memory"), S.Callbacks("once memory"), 1, "rejected"]], i = "pending", a = {state: function () {
        return i;
      }, always: function () {
        return s.done(arguments).fail(arguments), this;
      }, catch: function (e) {
        return a.then(null, e);
      }, pipe: function () {
        var i = arguments;
        return S.Deferred(function (r) {
          S.each(o, function (e, t) {
            var n = "function" == typeof i[t[4]] && "number" != typeof i[t[4]].nodeType && i[t[4]];
            s[t[1]](function () {
              var e = n && n.apply(this, arguments);
              e && ("function" == typeof e.promise && "number" != typeof e.promise.nodeType) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments);
            });
          }), i = null;
        }).promise();
      }, then: function (t, n, r) {
        var u = 0;
        function l(i, o, a, s) {
          return function () {
            function e() {
              var e, t;
              if (!(i < u)) {
                if ((e = a.apply(n, r)) === o.promise()) throw new TypeError("Thenable self-resolution");
                t = e && ("object" == typeof e || "function" == typeof e) && e.then, "function" == typeof t && "number" != typeof t.nodeType ? s ? t.call(e, l(u, o, R, s), l(u, o, M, s)) : (u++, t.call(e, l(u, o, R, s), l(u, o, M, s), l(u, o, R, o.notifyWith))) : (a !== R && (n = void 0, r = [e]), (s || o.resolveWith)(n, r));
              }
            }
            var n = this, r = arguments, t = s ? e : function () {
              try {
                e();
              } catch (e) {
                S.Deferred.exceptionHook && S.Deferred.exceptionHook(e, t.stackTrace), u <= i + 1 && (a !== M && (n = void 0, r = [e]), o.rejectWith(n, r));
              }
            };
            i ? t() : (S.Deferred.getStackHook && (t.stackTrace = S.Deferred.getStackHook()), C.setTimeout(t));
          };
        }
        return S.Deferred(function (e) {
          o[0][3].add(l(0, e, "function" == typeof r && "number" != typeof r.nodeType ? r : R, e.notifyWith)), o[1][3].add(l(0, e, "function" == typeof t && "number" != typeof t.nodeType ? t : R)), o[2][3].add(l(0, e, "function" == typeof n && "number" != typeof n.nodeType ? n : M));
        }).promise();
      }, promise: function (e) {
        return null != e ? S.extend(e, a) : a;
      }}, s = {};
      return S.each(o, function (e, t) {
        var n = t[2], r = t[5];
        a[t[1]] = n.add, r && n.add(function () {
          i = r;
        }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock), n.add(t[3].fire), s[t[0]] = function () {
          return s[t[0] + "With"](this === s ? void 0 : this, arguments), this;
        }, s[t[0] + "With"] = n.fireWith;
      }), a.promise(s), e && e.call(s, s), s;
    }, when: function (e) {
      function t(t) {
        return function (e) {
          i[t] = this, o[t] = 1 < arguments.length ? s.call(arguments) : e, --n || a.resolveWith(i, o);
        };
      }
      var n = arguments.length, r = n, i = Array(r), o = s.call(arguments), a = S.Deferred();
      if (n <= 1 && (I(e, a.done(t(r)).resolve, a.reject, !n), "pending" === a.state() || "function" == typeof (o[r] && o[r].then) && "number" != typeof (o[r] && o[r].then).nodeType)) return a.then();
      for (; r--;) I(o[r], t(r), a.reject);
      return a.promise();
    }});
    var W = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    S.Deferred.exceptionHook = function (e, t) {
      C.console && C.console.warn && e && W.test(e.name) && C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
    }, S.readyException = function (e) {
      C.setTimeout(function () {
        throw e;
      });
    };
    var F = S.Deferred();
    function B() {
      E.removeEventListener("DOMContentLoaded", B), C.removeEventListener("load", B), S.ready();
    }
    S.fn.ready = function (e) {
      return F.then(e).catch(function (e) {
        S.readyException(e);
      }), this;
    }, S.extend({isReady: false, readyWait: 1, ready: function (e) {
      (true === e ? --S.readyWait : S.isReady) || (S.isReady = true) !== e && 0 < --S.readyWait || F.resolveWith(E, [S]);
    }}), S.ready.then = F.then, "complete" === E.readyState || "loading" !== E.readyState && !E.documentElement.doScroll ? C.setTimeout(S.ready) : (E.addEventListener("DOMContentLoaded", B), C.addEventListener("load", B));
    var $ = function (e, t, n, r, i, o, a) {
      var s = 0, u = e.length, l = null == n;
      if ("object" === w(n)) for (s in i = true, n) $(e, t, s, n[s], true, o, a); else if (void 0 !== r && (i = true, "function" == typeof r && "number" != typeof r.nodeType || (a = true), l && (t = a ? (t.call(e, r), null) : (l = t, function (e, t, n) {
        return l.call(S(e), n);
      })), t)) for (; s < u; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
      return i ? e : l ? t.call(e) : u ? t(e[0], n) : o;
    }, _ = /^-ms-/, z = /-([a-z])/g;
    function G() {
      this.expando = S.expando + G.uid++;
    }
    G.uid = 1, G.prototype = {cache: function (e) {
      var t = e[this.expando];
      return t || (t = {}, (1 === e.nodeType || 9 === e.nodeType || !+e.nodeType) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {value: t, configurable: true}))), t;
    }, set: function (e, t, n) {
      var r, i = this.cache(e);
      if ("string" == typeof t) i[t.replace(_, "ms-").replace(z, U)] = n; else for (r in t) i[r.replace(_, "ms-").replace(z, U)] = t[r];
      return i;
    }, get: function (e, t) {
      return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][t.replace(_, "ms-").replace(z, U)];
    }, access: function (e, t, n) {
      return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t);
    }, remove: function (e, t) {
      var n, r = e[this.expando];
      if (void 0 !== r) {
        if (void 0 !== t) {
          n = (t = Array.isArray(t) ? t.map(X) : (t = t.replace(_, "ms-").replace(z, U)) in r ? [t] : t.match(P) || []).length;
          for (; n--;) delete r[t[n]];
        }
        void 0 !== t && !S.isEmptyObject(r) || (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando]);
      }
    }, hasData: function (e) {
      var t = e[this.expando];
      return void 0 !== t && !S.isEmptyObject(t);
    }};
    var Y = new G, Q = new G, J = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, K = /[A-Z]/g;
    function Z(e, t, n) {
      var r, i;
      if (void 0 === n && 1 === e.nodeType) if (r = "data-" + t.replace(K, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(r))) {
        try {
          n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : J.test(i) ? JSON.parse(i) : i);
        } catch (e) {}
        Q.set(e, t, n);
      } else n = void 0;
      return n;
    }
    S.extend({hasData: function (e) {
      return Q.hasData(e) || Y.hasData(e);
    }, data: function (e, t, n) {
      return Q.access(e, t, n);
    }, removeData: function (e, t) {
      Q.remove(e, t);
    }, _data: function (e, t, n) {
      return Y.access(e, t, n);
    }, _removeData: function (e, t) {
      Y.remove(e, t);
    }}), S.fn.extend({data: function (n, e) {
      var t, r, i, o = this[0], a = o && o.attributes;
      if (void 0 !== n) return "object" == typeof n ? this.each(function () {
        Q.set(this, n);
      }) : $(this, function (e) {
        var t;
        return o && void 0 === e ? void 0 !== (t = Q.get(o, n)) || void 0 !== (t = Z(o, n)) ? t : void 0 : void this.each(function () {
          Q.set(this, n, e);
        });
      }, null, e, 1 < arguments.length, null, true);
      if (this.length && (i = Q.get(o), 1 === o.nodeType && !Y.get(o, "hasDataAttrs"))) {
        for (t = a.length; t--;) a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = r.slice(5).replace(_, "ms-").replace(z, U), Z(o, r, i[r]));
        Y.set(o, "hasDataAttrs", true);
      }
      return i;
    }, removeData: function (e) {
      return this.each(function () {
        Q.remove(this, e);
      });
    }}), S.extend({queue: function (e, t, n) {
      var r;
      if (e) return t = (t || "fx") + "queue", r = Y.get(e, t), n && (!r || Array.isArray(n) ? r = Y.access(e, t, S.makeArray(n)) : r.push(n)), r || [];
    }, dequeue: function (e, t) {
      t = t || "fx";
      var n = S.queue(e, t), r = n.length, i = n.shift(), o = S._queueHooks(e, t);
      "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, function () {
        S.dequeue(e, t);
      }, o)), !r && o && o.empty.fire();
    }, _queueHooks: function (e, t) {
      var n = t + "queueHooks";
      return Y.get(e, n) || Y.access(e, n, {empty: S.Callbacks("once memory").add(function () {
        Y.remove(e, [t + "queue", n]);
      })});
    }}), S.fn.extend({queue: function (t, n) {
      var e = 2;
      return "string" != typeof t && (n = t, t = "fx", e--), arguments.length < e ? S.queue(this[0], t) : void 0 === n ? this : this.each(function () {
        var e = S.queue(this, t, n);
        S._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && S.dequeue(this, t);
      });
    }, dequeue: function (e) {
      return this.each(function () {
        S.dequeue(this, e);
      });
    }, clearQueue: function (e) {
      return this.queue(e || "fx", []);
    }, promise: function (e, t) {
      function n() {
        --i || o.resolveWith(a, [a]);
      }
      var r, i = 1, o = S.Deferred(), a = this, s = this.length;
      for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; s--;) (r = Y.get(a[s], e + "queueHooks")) && r.empty && (i++, r.empty.add(n));
      return n(), o.promise(t);
    }});
    var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$", "i"), ne = ["Top", "Right", "Bottom", "Left"], re = E.documentElement, oe = {composed: true};
    re.getRootNode && (ie = function (e) {
      return S.contains(e.ownerDocument, e) || e.getRootNode(oe) === e.ownerDocument;
    });
    function se(e, t, n, r) {
      var i, o, a = 20, s = r ? function () {
        return r.cur();
      } : function () {
        return S.css(e, t, "");
      }, u = s(), l = n && n[3] || (S.cssNumber[t] ? "" : "px"), c = e.nodeType && (S.cssNumber[t] || "px" !== l && +u) && te.exec(S.css(e, t));
      if (c && c[3] !== l) {
        for (u /= 2, l = l || c[3], c = +u || 1; a--;) S.style(e, t, c + l), (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0), c /= o;
        c *= 2, S.style(e, t, c + l), n = n || [];
      }
      return n && (c = +c || +u || 0, i = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = l, r.start = c, r.end = i)), i;
    }
    var ue = {};
    function le(e, t) {
      for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++) (r = e[c]).style && (n = r.style.display, t ? ("none" === n && (l[c] = Y.get(r, "display") || null, l[c] || (r.style.display = "")), "" === r.style.display && ("none" === (r = t || r).style.display || "" === r.style.display && S.contains(r.ownerDocument, r) && "none" === S.css(r, "display")) && (l[c] = (u = s = a = o = void 0, a = (i = r).ownerDocument, s = i.nodeName, (u = ue[s]) || (o = a.body.appendChild(a.createElement(s)), u = S.css(o, "display"), o.parentNode.removeChild(o), "none" === u && (u = "block"), ue[s] = u)))) : "none" !== n && (l[c] = "none", Y.set(r, "display", n)));
      for (c = 0; c < f; c++) null != l[c] && (e[c].style.display = l[c]);
      return e;
    }
    S.fn.extend({show: function () {
      return le(this, true);
    }, hide: function () {
      return le(this);
    }, toggle: function (e) {
      return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
        "none" === (this = t || this).style.display || "" === this.style.display && S.contains(this.ownerDocument, this) && "none" === S.css(this, "display") ? S(this).show() : S(this).hide();
      });
    }});
    var ce, fe, pe = /^(?:checkbox|radio)$/i, de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, he = /^$|^module$|\/(?:java|ecma)script/i;
    ce = E.createDocumentFragment().appendChild(E.createElement("div")), (fe = E.createElement("input")).setAttribute("type", "radio"), fe.setAttribute("checked", "checked"), fe.setAttribute("name", "t"), ce.appendChild(fe), m.checkClone = ce.cloneNode(true).cloneNode(true).lastChild.checked, ce.innerHTML = "<textarea>x</textarea>", m.noCloneChecked = !!ce.cloneNode(true).lastChild.defaultValue, ce.innerHTML = "<option></option>", m.option = !!ce.lastChild;
    var ge = {thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""]};
    function ve(e, t) {
      var n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
      return void 0 === t || t && (e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()) ? S.merge([e], n) : n;
    }
    function ye(e, t) {
      for (var n = 0, r = e.length; n < r; n++) Y.set(e[n], "globalEval", !t || Y.get(t[n], "globalEval"));
    }
    ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead, ge.th = ge.td, m.option || (ge.optgroup = ge.option = [1, "<select multiple='multiple'>", "</select>"]);
    var me = /<|&#?\w+;/;
    function xe(e, t, n, r, i) {
      for (var o, a, s, u, l, c, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; d < h; d++) if ((o = e[d]) || 0 === o) if ("object" === w(o)) S.merge(p, o.nodeType ? [o] : o); else if (me.test(o)) {
        for (a = a || f.appendChild(t.createElement("div")), s = (de.exec(o) || ["", ""])[1].toLowerCase(), u = ge[s] || ge._default, a.innerHTML = u[1] + S.htmlPrefilter(o) + u[2], c = u[0]; c--;) a = a.lastChild;
        S.merge(p, a.childNodes), (a = f.firstChild).textContent = "";
      } else p.push(t.createTextNode(o));
      for (f.textContent = "", d = 0; o = p[d++];) if (r && -1 < S.inArray(o, r)) i && i.push(o); else if (l = S.contains(o.ownerDocument, o), a = ve(f.appendChild(o), "script"), l && ye(a), n) for (c = 0; o = a[c++];) he.test(o.type || "") && n.push(o);
      return f;
    }
    var be = /^key/, we = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Te = /^([^.]*)(?:\.(.+)|)/;
    function Se(e, t) {
      return e === function () {
        try {
          return E.activeElement;
        } catch (e) {}
      }() == ("focus" === t);
    }
    function ke(e, t, n, r, i, o) {
      var a, s;
      if ("object" == typeof t) {
        for (s in "string" != typeof n && (r = r || n, n = void 0), t) ke(e, s, n, r, t[s], o);
        return e;
      }
      if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), false === i) i = Ee; else if (!i) return e;
      return 1 === o && (a = i, (i = function (e) {
        return S().off(e), a.apply(this, arguments);
      }).guid = a.guid || (a.guid = S.guid++)), e.each(function () {
        S.event.add(this, t, i, r, n);
      });
    }
    function Ae(e, i, o) {
      o ? (Y.set(e, i, false), S.event.add(e, i, {namespace: false, handler: function (e) {
        var t, n, r = Y.get(this, i);
        if (1 & e.isTrigger && this[i]) {
          if (r.length) (S.event.special[i] || {}).delegateType && e.stopPropagation(); else if (r = s.call(arguments), Y.set(this, i, r), t = o(this, i), this[i](), r !== (n = Y.get(this, i)) || t ? Y.set(this, i, false) : n = {}, r !== n) return e.stopImmediatePropagation(), e.preventDefault(), n.value;
        } else r.length && (Y.set(this, i, {value: S.event.trigger(S.extend(r[0], S.Event.prototype), r.slice(1), this)}), e.stopImmediatePropagation());
      }})) : void 0 === Y.get(e, i) && S.event.add(e, i, Ce);
    }
    S.event = {global: {}, add: function (t, e, n, r, i) {
      var o, a, s, u, l, c, f, p, d, h, g, v = Y.get(t);
      if (1 === t.nodeType || 9 === t.nodeType || !+t.nodeType) for (n.handler && (n = (o = n).handler, i = o.selector), i && S.find.matchesSelector(re, i), n.guid || (n.guid = S.guid++), (u = v.events) || (u = v.events = Object.create(null)), (a = v.handle) || (a = v.handle = function (e) {
        return void 0 !== S && S.event.triggered !== e.type ? S.event.dispatch.apply(t, arguments) : void 0;
      }), l = (e = (e || "").match(P) || [""]).length; l--;) d = g = (s = Te.exec(e[l]) || [])[1], h = (s[2] || "").split(".").sort(), d && (f = S.event.special[d] || {}, d = (i ? f.delegateType : f.bindType) || d, f = S.event.special[d] || {}, c = S.extend({type: d, origType: g, data: r, handler: n, guid: n.guid, selector: i, needsContext: i && S.expr.match.needsContext.test(i), namespace: h.join(".")}, o), (p = u[d]) || ((p = u[d] = []).delegateCount = 0, f.setup && false !== f.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(d, a)), f.add && (f.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)), i ? p.splice(p.delegateCount++, 0, c) : p.push(c), S.event.global[d] = true);
    }, remove: function (e, t, n, r, i) {
      var o, a, s, u, l, c, f, p, d, h, g, v = Y.hasData(e) && Y.get(e);
      if (v && (u = v.events)) {
        for (l = (t = (t || "").match(P) || [""]).length; l--;) if (d = g = (s = Te.exec(t[l]) || [])[1], h = (s[2] || "").split(".").sort(), d) {
          for (f = S.event.special[d] || {}, p = u[d = (r ? f.delegateType : f.bindType) || d] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = p.length; o--;) c = p[o], !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1), c.selector && p.delegateCount--, f.remove && f.remove.call(e, c));
          a && !p.length && (f.teardown && false !== f.teardown.call(e, h, v.handle) || S.removeEvent(e, d, v.handle), delete u[d]);
        } else for (d in u) S.event.remove(e, d + t[l], n, r, true);
        S.isEmptyObject(u) && Y.remove(e, "handle events");
      }
    }, dispatch: function (e) {
      var t, n, r, i, o, a, s = new Array(arguments.length), u = S.event.fix(e), l = (Y.get(this, "events") || Object.create(null))[u.type] || [], c = S.event.special[u.type] || {};
      for (s[0] = u, t = 1; t < arguments.length; t++) s[t] = arguments[t];
      if (u.delegateTarget = this, !c.preDispatch || false !== c.preDispatch.call(this, u)) {
        for (a = S.event.handlers.call(this, u, l), t = 0; (i = a[t++]) && !u.isPropagationStopped();) for (u.currentTarget = i.elem, n = 0; (o = i.handlers[n++]) && !u.isImmediatePropagationStopped();) u.rnamespace && false !== o.namespace && !u.rnamespace.test(o.namespace) || (u.handleObj = o, u.data = o.data, void 0 !== (r = ((S.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && false === (u.result = r) && (u.preventDefault(), u.stopPropagation()));
        return c.postDispatch && c.postDispatch.call(this, u), u.result;
      }
    }, handlers: function (e, t) {
      var n, r, i, o, a, s = [], u = t.delegateCount, l = e.target;
      if (u && l.nodeType && !("click" === e.type && 1 <= e.button)) for (; l !== this; l = l.parentNode || this) if (1 === l.nodeType && ("click" !== e.type || true !== l.disabled)) {
        for (o = [], a = {}, n = 0; n < u; n++) void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < S(i, this).index(l) : S.find(i, this, null, [l]).length), a[i] && o.push(r);
        o.length && s.push({elem: l, handlers: o});
      }
      return l = this, u < t.length && s.push({elem: l, handlers: t.slice(u)}), s;
    }, addProp: function (t, e) {
      Object.defineProperty(S.Event.prototype, t, {enumerable: true, configurable: true, get: "function" == typeof e && "number" != typeof e.nodeType ? function () {
        if (this.originalEvent) return e(this.originalEvent);
      } : function () {
        if (this.originalEvent) return this.originalEvent[t];
      }, set: function (e) {
        Object.defineProperty(this, t, {enumerable: true, configurable: true, writable: true, value: e});
      }});
    }, fix: function (e) {
      return e[S.expando] ? e : new S.Event(e);
    }, special: {load: {noBubble: true}, click: {setup: function (e) {
      var t = this || e;
      return pe.test(t.type) && t.click && (t.nodeName && t.nodeName.toLowerCase() === "input".toLowerCase()) && Ae(t, "click", Ce), false;
    }, trigger: function (e) {
      var t = this || e;
      return pe.test(t.type) && t.click && (t.nodeName && t.nodeName.toLowerCase() === "input".toLowerCase()) && Ae(t, "click"), true;
    }, _default: function (e) {
      var t = e.target;
      return pe.test(t.type) && t.click && (t.nodeName && t.nodeName.toLowerCase() === "input".toLowerCase()) && Y.get(t, "click") || t.nodeName && t.nodeName.toLowerCase() === "a".toLowerCase();
    }}, beforeunload: {postDispatch: function (e) {
      void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result);
    }}}}, S.removeEvent = function (e, t, n) {
      e.removeEventListener && e.removeEventListener(t, n);
    }, S.Event = function (e, t) {
      if (!(this instanceof S.Event)) return new S.Event(e, t);
      e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && false === e.returnValue ? Ce : Ee, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && S.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[S.expando] = true;
    }, S.Event.prototype = {constructor: S.Event, isDefaultPrevented: Ee, isPropagationStopped: Ee, isImmediatePropagationStopped: Ee, isSimulated: false, preventDefault: function () {
      var e = this.originalEvent;
      this.isDefaultPrevented = Ce, e && !this.isSimulated && e.preventDefault();
    }, stopPropagation: function () {
      var e = this.originalEvent;
      this.isPropagationStopped = Ce, e && !this.isSimulated && e.stopPropagation();
    }, stopImmediatePropagation: function () {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = Ce, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation();
    }}, S.each({altKey: true, bubbles: true, cancelable: true, changedTouches: true, ctrlKey: true, detail: true, eventPhase: true, metaKey: true, pageX: true, pageY: true, shiftKey: true, view: true, char: true, code: true, charCode: true, key: true, keyCode: true, button: true, buttons: true, clientX: true, clientY: true, offsetX: true, offsetY: true, pointerId: true, pointerType: true, screenX: true, screenY: true, targetTouches: true, toElement: true, touches: true, which: function (e) {
      var t = e.button;
      return null == e.which && be.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && we.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which;
    }}, S.event.addProp), S.each({focus: "focusin", blur: "focusout"}, function (e, t) {
      S.event.special[e] = {setup: function () {
        return Ae(this, e, Se), false;
      }, trigger: function () {
        return Ae(this, e), true;
      }, delegateType: t};
    }), S.each({mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout"}, function (e, i) {
      S.event.special[e] = {delegateType: i, bindType: i, handle: function (e) {
        var t, n = e.relatedTarget, r = e.handleObj;
        return n && (n === this || S.contains(this, n)) || (e.type = r.origType, t = r.handler.apply(this, arguments), e.type = i), t;
      }};
    }), S.fn.extend({on: function (e, t, n, r) {
      return ke(this, e, t, n, r);
    }, one: function (e, t, n, r) {
      return ke(this, e, t, n, r, 1);
    }, off: function (e, t, n) {
      var r, i;
      if (e && e.preventDefault && e.handleObj) return r = e.handleObj, S(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
      if ("object" != typeof e) return false !== t && "function" != typeof t || (n = t, t = void 0), false === n && (n = Ee), this.each(function () {
        S.event.remove(this, e, n, t);
      });
      for (i in e) this.off(i, t, e[i]);
      return this;
    }});
    var Ne = /<script|<style|<link/i, De = /checked\s*(?:[^=]|=\s*.checked.)/i, je = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function Oe(e, t) {
      var n, r, i, o, a, s;
      if (1 === t.nodeType) {
        if (Y.hasData(e) && (s = Y.get(e).events)) for (i in Y.remove(t, "handle events"), s) for (n = 0, r = s[i].length; n < r; n++) S.event.add(t, i, s[i][n]);
        Q.hasData(e) && (o = Q.access(e), a = S.extend({}, o), Q.set(t, a));
      }
    }
    function Pe(n, r, i, o) {
      r = v(r);
      var e, t, a, s, u, l, c = 0, f = n.length, p = f - 1, d = r[0], h = "function" == typeof d && "number" != typeof d.nodeType;
      if (h || 1 < f && "string" == typeof d && !m.checkClone && De.test(d)) return n.each(function (e) {
        var t = n.eq(e);
        h && (r[0] = d.call(this, e, t.html())), Pe(t, r, i, o);
      });
      if (f && (t = (e = xe(r, n[0].ownerDocument, false, n, o)).firstChild, 1 === e.childNodes.length && (e = t), t || o)) {
        for (s = (a = S.map(ve(e, "script"), Le)).length; c < f; c++) u = e, c !== p && (u = S.clone(u, true, true), s && S.merge(a, ve(u, "script"))), i.call(n[c], u, c);
        if (s) for (l = a[a.length - 1].ownerDocument, S.map(a, He), c = 0; c < s; c++) u = a[c], he.test(u.type || "") && !Y.access(u, "globalEval") && S.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? S._evalUrl && !u.noModule && S._evalUrl(u.src, {nonce: u.nonce || u.getAttribute("nonce")}, l) : b(u.textContent.replace(je, ""), u, l));
      }
      return n;
    }
    function Re(e, t, n) {
      for (var r, i = t ? S.filter(t, e) : e, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || S.cleanData(ve(r)), r.parentNode && (n && S.contains(r.ownerDocument, r) && ye(ve(r, "script")), r.parentNode.removeChild(r));
      return e;
    }
    S.extend({htmlPrefilter: function (e) {
      return e;
    }, clone: function (e, t, n) {
      var r, i, o, a, s, u, l, c = e.cloneNode(true), f = S.contains(e.ownerDocument, e);
      if (!(m.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || S.isXMLDoc(e))) for (a = ve(c), r = 0, i = (o = ve(e)).length; r < i; r++) s = o[r], u = a[r], l = void 0, "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
      if (t) if (n) for (o = o || ve(e), a = a || ve(c), r = 0, i = o.length; r < i; r++) Oe(o[r], a[r]); else Oe(e, c);
      return 0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")), c;
    }, cleanData: function (e) {
      for (var t, n, r, i = S.event.special, o = 0; void 0 !== (n = e[o]); o++) if (1 === n.nodeType || 9 === n.nodeType || !+n.nodeType) {
        if (t = n[Y.expando]) {
          if (t.events) for (r in t.events) i[r] ? S.event.remove(n, r) : S.removeEvent(n, r, t.handle);
          n[Y.expando] = void 0;
        }
        n[Q.expando] && (n[Q.expando] = void 0);
      }
    }}), S.fn.extend({detach: function (e) {
      return Re(this, e, true);
    }, remove: function (e) {
      return Re(this, e);
    }, text: function (e) {
      return $(this, function (e) {
        return void 0 === e ? S.text(this) : this.empty().each(function () {
          1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e);
        });
      }, null, e, arguments.length);
    }, append: function () {
      return Pe(this, arguments, function (e) {
        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.nodeName && this.nodeName.toLowerCase() === "table".toLowerCase() && ((11 !== e.nodeType ? e : e.firstChild).nodeName && (11 !== e.nodeType ? e : e.firstChild).nodeName.toLowerCase() === "tr".toLowerCase()) && S(this).children("tbody")[0] || this).appendChild(e);
      });
    }, prepend: function () {
      return Pe(this, arguments, function (e) {
        var t;
        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (t = this.nodeName && this.nodeName.toLowerCase() === "table".toLowerCase() && ((11 !== e.nodeType ? e : e.firstChild).nodeName && (11 !== e.nodeType ? e : e.firstChild).nodeName.toLowerCase() === "tr".toLowerCase()) && S(this).children("tbody")[0] || this).insertBefore(e, t.firstChild);
      });
    }, before: function () {
      return Pe(this, arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this);
      });
    }, after: function () {
      return Pe(this, arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
      });
    }, empty: function () {
      for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (S.cleanData(ve(e, false)), e.textContent = "");
      return this;
    }, clone: function (e, t) {
      return e = null != e && e, t = null == t ? e : t, this.map(function () {
        return S.clone(this, e, t);
      });
    }, html: function (e) {
      return $(this, function (e) {
        var t = this[0] || {}, n = 0, r = this.length;
        if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
        if ("string" == typeof e && !Ne.test(e) && !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]) {
          e = S.htmlPrefilter(e);
          try {
            for (; n < r; n++) 1 === (t = this[n] || {}).nodeType && (S.cleanData(ve(t, false)), t.innerHTML = e);
            t = 0;
          } catch (e) {}
        }
        t && this.empty().append(e);
      }, null, e, arguments.length);
    }, replaceWith: function () {
      var n = [];
      return Pe(this, arguments, function (e) {
        var t = this.parentNode;
        S.inArray(this, n) < 0 && (S.cleanData(ve(this)), t && t.replaceChild(e, this));
      }, n);
    }}), S.each({appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith"}, function (e, a) {
      S.fn[e] = function (e) {
        for (var t, n = [], r = S(e), i = r.length - 1, o = 0; o <= i; o++) t = o === i ? this : this.clone(true), S(r[o])[a](t), u.apply(n, t.get());
        return this.pushStack(n);
      };
    });
    function Me(e, t, n) {
      var r, i, o = {};
      for (i in t) o[i] = e.style[i], e.style[i] = t[i];
      for (i in r = n.call(e), t) e.style[i] = o[i];
      return r;
    }
    var Ie, We, Fe, Be, $e, _e, ze, Ue, Xe = new RegExp("^(" + ee + ")(?!px)[a-z%]+$", "i"), Ve = function (e) {
      var t = e.ownerDocument.defaultView;
      return t && t.opener || (t = C), t.getComputedStyle(e);
    }, Ge = new RegExp(ne.join("|"), "i");
    function Ye() {
      var e;
      Ue && (ze.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", Ue.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", re.appendChild(ze).appendChild(Ue), e = C.getComputedStyle(Ue), Ie = "1%" !== e.top, _e = 12 === Math.round(parseFloat(e.marginLeft)), Ue.style.right = "60%", Be = 36 === Math.round(parseFloat(e.right)), We = 36 === Math.round(parseFloat(e.width)), Ue.style.position = "absolute", Fe = 12 === Math.round(parseFloat(Ue.offsetWidth / 3)), re.removeChild(ze), Ue = null);
    }
    function Je(e, t, n) {
      var r, i, o, a, s = e.style;
      return (n = n || Ve(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || S.contains(e.ownerDocument, e) || (a = S.style(e, t)), !m.pixelBoxStyles() && Xe.test(a) && Ge.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a;
    }
    function Ke(e, t) {
      return {get: function () {
        if (!e()) return (this.get = t).apply(this, arguments);
        delete this.get;
      }};
    }
    ze = E.createElement("div"), (Ue = E.createElement("div")).style && (Ue.style.backgroundClip = "content-box", Ue.cloneNode(true).style.backgroundClip = "", m.clearCloneStyle = "content-box" === Ue.style.backgroundClip, S.extend(m, {boxSizingReliable: function () {
      return Ye(), We;
    }, pixelBoxStyles: function () {
      return Ye(), Be;
    }, pixelPosition: function () {
      return Ye(), Ie;
    }, reliableMarginLeft: function () {
      return Ye(), _e;
    }, scrollboxSize: function () {
      return Ye(), Fe;
    }, reliableTrDimensions: function () {
      var e, t, n, r;
      return null == $e && (e = E.createElement("table"), t = E.createElement("tr"), n = E.createElement("div"), e.style.cssText = "position:absolute;left:-11111px", t.style.height = "1px", n.style.height = "9px", re.appendChild(e).appendChild(t).appendChild(n), r = C.getComputedStyle(t), $e = 3 < parseInt(r.height), re.removeChild(e)), $e;
    }}));
    var Ze = ["Webkit", "Moz", "ms"], et = E.createElement("div").style, tt = {};
    function nt(e) {
      var t = S.cssProps[e] || tt[e];
      return t || (e in et ? e : tt[e] = function (e) {
        for (var t = e[0].toUpperCase() + e.slice(1), n = Ze.length; n--;) if ((e = Ze[n] + t) in et) return e;
      }(e) || e);
    }
    var rt = /^(none|table(?!-c[ea]).+)/, it = /^--/, ot = {position: "absolute", visibility: "hidden", display: "block"}, at = {letterSpacing: "0", fontWeight: "400"};
    function st(e, t, n) {
      var r = te.exec(t);
      return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
    }
    function ut(e, t, n, r, i, o) {
      var a = "width" === t ? 1 : 0, s = 0, u = 0;
      if (n === (r ? "border" : "content")) return 0;
      for (; a < 4; a += 2) "margin" === n && (u += S.css(e, n + ne[a], true, i)), r ? ("content" === n && (u -= S.css(e, "padding" + ne[a], true, i)), "margin" !== n && (u -= S.css(e, "border" + ne[a] + "Width", true, i))) : (u += S.css(e, "padding" + ne[a], true, i), "padding" !== n ? u += S.css(e, "border" + ne[a] + "Width", true, i) : s += S.css(e, "border" + ne[a] + "Width", true, i));
      return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0), u;
    }
    function lt(e, t, n) {
      var r = Ve(e), i = (!m.boxSizingReliable() || n) && "border-box" === S.css(e, "boxSizing", false, r), o = i, a = Je(e, t, r), s = "offset" + t[0].toUpperCase() + t.slice(1);
      if (Xe.test(a)) {
        if (!n) return a;
        a = "auto";
      }
      return (!m.boxSizingReliable() && i || !m.reliableTrDimensions() && (e.nodeName && e.nodeName.toLowerCase() === "tr".toLowerCase()) || "auto" === a || !parseFloat(a) && "inline" === S.css(e, "display", false, r)) && e.getClientRects().length && (i = "border-box" === S.css(e, "boxSizing", false, r), (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + ut(e, t, n || (i ? "border" : "content"), o, r, a) + "px";
    }
    function ct(e, t, n, r, i) {
      return new ct.prototype.init(e, t, n, r, i);
    }
    S.extend({cssHooks: {opacity: {get: function (e, t) {
      if (t) {
        var n = Je(e, "opacity");
        return "" === n ? "1" : n;
      }
    }}}, cssNumber: {animationIterationCount: true, columnCount: true, fillOpacity: true, flexGrow: true, flexShrink: true, fontWeight: true, gridArea: true, gridColumn: true, gridColumnEnd: true, gridColumnStart: true, gridRow: true, gridRowEnd: true, gridRowStart: true, lineHeight: true, opacity: true, order: true, orphans: true, widows: true, zIndex: true, zoom: true}, cssProps: {}, style: function (e, t, n, r) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var i, o, a, s = t.replace(_, "ms-").replace(z, U), u = it.test(t), l = e.style;
        if (u || (t = nt(s)), a = S.cssHooks[t] || S.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, false, r)) ? i : l[t];
        "string" === (o = typeof n) && (i = te.exec(n)) && i[1] && (n = se(e, t, i), o = "number"), null != n && n == n && ("number" !== o || u || (n += i && i[3] || (S.cssNumber[s] ? "" : "px")), m.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n));
      }
    }, css: function (e, t, n, r) {
      var i, o, a, s = t.replace(_, "ms-").replace(z, U);
      return it.test(t) || (t = nt(s)), (a = S.cssHooks[t] || S.cssHooks[s]) && "get" in a && (i = a.get(e, true, n)), void 0 === i && (i = Je(e, t, r)), "normal" === i && t in at && (i = at[t]), "" === n || n ? (o = parseFloat(i), true === n || isFinite(o) ? o || 0 : i) : i;
    }}), S.each(["height", "width"], function (e, u) {
      S.cssHooks[u] = {get: function (e, t, n) {
        if (t) return !rt.test(S.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? lt(e, u, n) : Me(e, ot, function () {
          return lt(e, u, n);
        });
      }, set: function (e, t, n) {
        var r, i = Ve(e), o = !m.scrollboxSize() && "absolute" === i.position, a = (o || n) && "border-box" === S.css(e, "boxSizing", false, i), s = n ? ut(e, u, n, a, i) : 0;
        return a && o && (s -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - ut(e, u, "border", false, i) - .5)), s && (r = te.exec(t)) && "px" !== (r[3] || "px") && (e.style[u] = t, t = S.css(e, u)), st(0, t, s);
      }};
    }), S.cssHooks.marginLeft = Ke(m.reliableMarginLeft, function (e, t) {
      if (t) return (parseFloat(Je(e, "marginLeft")) || e.getBoundingClientRect().left - Me(e, {marginLeft: 0}, function () {
        return e.getBoundingClientRect().left;
      })) + "px";
    }), S.each({margin: "", padding: "", border: "Width"}, function (i, o) {
      S.cssHooks[i + o] = {expand: function (e) {
        for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++) n[i + ne[t] + o] = r[t] || r[t - 2] || r[0];
        return n;
      }}, "margin" !== i && (S.cssHooks[i + o].set = st);
    }), S.fn.extend({css: function (e, t) {
      return $(this, function (e, t, n) {
        var r, i, o = {}, a = 0;
        if (Array.isArray(t)) {
          for (r = Ve(e), i = t.length; a < i; a++) o[t[a]] = S.css(e, t[a], false, r);
          return o;
        }
        return void 0 !== n ? S.style(e, t, n) : S.css(e, t);
      }, e, t, 1 < arguments.length);
    }}), (S.Tween = ct).prototype = {constructor: ct, init: function (e, t, n, r, i, o) {
      this.elem = e, this.prop = n, this.easing = i || S.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (S.cssNumber[n] ? "" : "px");
    }, cur: function () {
      var e = ct.propHooks[this.prop];
      return e && e.get ? e.get(this) : ct.propHooks._default.get(this);
    }, run: function (e) {
      var t, n = ct.propHooks[this.prop];
      return this.options.duration ? this.pos = t = S.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : ct.propHooks._default.set(this), this;
    }}, ct.prototype.init.prototype = ct.prototype, ct.propHooks = {_default: {get: function (e) {
      var t;
      return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = S.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0;
    }, set: function (e) {
      S.fx.step[e.prop] ? S.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !S.cssHooks[e.prop] && null == e.elem.style[nt(e.prop)] ? e.elem[e.prop] = e.now : S.style(e.elem, e.prop, e.now + e.unit);
    }}}, ct.propHooks.scrollTop = ct.propHooks.scrollLeft = {set: function (e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
    }}, S.easing = {linear: function (e) {
      return e;
    }, swing: function (e) {
      return .5 - Math.cos(e * Math.PI) / 2;
    }, _default: "swing"}, S.fx = ct.prototype.init, S.fx.step = {};
    var ft, pt, dt, ht, gt = /^(?:toggle|show|hide)$/, vt = /queueHooks$/;
    function yt() {
      pt && (false === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(yt) : C.setTimeout(yt, S.fx.interval), S.fx.tick());
    }
    function mt() {
      return C.setTimeout(function () {
        ft = void 0;
      }), ft = Date.now();
    }
    function xt(e, t) {
      var n, r = 0, i = {height: e};
      for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (n = ne[r])] = i["padding" + n] = e;
      return t && (i.opacity = i.width = e), i;
    }
    function bt(e, t, n) {
      for (var r, i = (wt.tweeners[t] || []).concat(wt.tweeners["*"]), o = 0, a = i.length; o < a; o++) if (r = i[o].call(n, t, e)) return r;
    }
    function wt(o, e, t) {
      var n, a, r = 0, i = wt.prefilters.length, s = S.Deferred().always(function () {
        delete u.elem;
      }), u = function () {
        if (a) return false;
        for (var e = ft || mt(), t = Math.max(0, l.startTime + l.duration - e), n = 1 - (t / l.duration || 0), r = 0, i = l.tweens.length; r < i; r++) l.tweens[r].run(n);
        return s.notifyWith(o, [l, n, t]), n < 1 && i ? t : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), false);
      }, l = s.promise({elem: o, props: S.extend({}, e), opts: S.extend(true, {specialEasing: {}, easing: S.easing._default}, t), originalProperties: e, originalOptions: t, startTime: ft || mt(), duration: t.duration, tweens: [], createTween: function (e, t) {
        var n = S.Tween(o, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing);
        return l.tweens.push(n), n;
      }, stop: function (e) {
        var t = 0, n = e ? l.tweens.length : 0;
        if (a) return this;
        for (a = true; t < n; t++) l.tweens[t].run(1);
        return e ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e])) : s.rejectWith(o, [l, e]), this;
      }}), c = l.props;
      for (!function (e, t) {
        var n, r, i, o, a;
        for (n in e) if (i = t[r = n.replace(_, "ms-").replace(z, U)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = S.cssHooks[r]) && "expand" in a) for (n in o = a.expand(o), delete e[r], o) n in e || (e[n] = o[n], t[n] = i); else t[r] = i;
      }(c, l.opts.specialEasing); r < i; r++) if (n = wt.prefilters[r].call(l, o, c, l.opts)) return "function" == typeof n.stop && "number" != typeof n.stop.nodeType && (S._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)), n;
      return S.map(c, bt, l), "function" == typeof l.opts.start && "number" != typeof l.opts.start.nodeType && l.opts.start.call(o, l), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always), S.fx.timer(S.extend(u, {elem: o, anim: l, queue: l.opts.queue})), l;
    }
    S.Animation = S.extend(wt, {tweeners: {"*": [function (e, t) {
      var n = this.createTween(e, t);
      return se(n.elem, e, te.exec(t), n), n;
    }]}, tweener: function (e, t) {
      for (var n, r = 0, i = (e = "function" == typeof e && "number" != typeof e.nodeType ? (t = e, ["*"]) : e.match(P)).length; r < i; r++) n = e[r], wt.tweeners[n] = wt.tweeners[n] || [], wt.tweeners[n].unshift(t);
    }, prefilters: [function (e, t, n) {
      var r, i, o, a, s, u, l, c, f = "width" in t || "height" in t, p = this, d = {}, h = e.style, g = e.nodeType && ("none" === (e = t || e).style.display || "" === e.style.display && S.contains(e.ownerDocument, e) && "none" === S.css(e, "display")), v = Y.get(e, "fxshow");
      for (r in n.queue || (null == (a = S._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () {
        a.unqueued || s();
      }), a.unqueued++, p.always(function () {
        p.always(function () {
          a.unqueued--, S.queue(e, "fx").length || a.empty.fire();
        });
      })), t) if (i = t[r], gt.test(i)) {
        if (delete t[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
          if ("show" !== i || !v || void 0 === v[r]) continue;
          g = true;
        }
        d[r] = v && v[r] || S.style(e, r);
      }
      if ((u = !S.isEmptyObject(t)) || !S.isEmptyObject(d)) for (r in f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (l = v && v.display) && (l = Y.get(e, "display")), "none" === (c = S.css(e, "display")) && (l ? c = l : (le([e], true), l = e.style.display || l, c = S.css(e, "display"), le([e]))), ("inline" === c || "inline-block" === c && null != l) && "none" === S.css(e, "float") && (u || (p.done(function () {
        h.display = l;
      }), null == l && (c = h.display, l = "none" === c ? "" : c)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", p.always(function () {
        h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2];
      })), u = false, d) u || (v ? "hidden" in v && (g = v.hidden) : v = Y.access(e, "fxshow", {display: l}), o && (v.hidden = !g), g && le([e], true), p.done(function () {
        for (r in g || le([e]), Y.remove(e, "fxshow"), d) S.style(e, r, d[r]);
      })), u = bt(g ? v[r] : 0, r, p), r in v || (v[r] = u.start, g && (u.end = u.start, u.start = 0));
    }], prefilter: function (e, t) {
      t ? wt.prefilters.unshift(e) : wt.prefilters.push(e);
    }}), S.speed = function (e, t, n) {
      var r = e && "object" == typeof e ? S.extend({}, e) : {complete: n || !n && t || "function" == typeof e && "number" != typeof e.nodeType && e, duration: e, easing: n && t || t && !("function" == typeof t && "number" != typeof t.nodeType) && t};
      return S.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in S.fx.speeds ? r.duration = S.fx.speeds[r.duration] : r.duration = S.fx.speeds._default), null != r.queue && true !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function () {
        "function" == typeof r.old && "number" != typeof r.old.nodeType && r.old.call(this), r.queue && S.dequeue(this, r.queue);
      }, r;
    }, S.fn.extend({fadeTo: function (e, t, n, r) {
      return this.filter(ae).css("opacity", 0).show().end().animate({opacity: t}, e, n, r);
    }, animate: function (t, e, n, r) {
      function i() {
        var e = wt(this, S.extend({}, t), a);
        (o || Y.get(this, "finish")) && e.stop(true);
      }
      var o = S.isEmptyObject(t), a = S.speed(e, n, r);
      return i.finish = i, o || false === a.queue ? this.each(i) : this.queue(a.queue, i);
    }, stop: function (i, e, o) {
      function a(e) {
        var t = e.stop;
        delete e.stop, t(o);
      }
      return "string" != typeof i && (o = e, e = i, i = void 0), e && this.queue(i || "fx", []), this.each(function () {
        var e = true, t = null != i && i + "queueHooks", n = S.timers, r = Y.get(this);
        if (t) r[t] && r[t].stop && a(r[t]); else for (t in r) r[t] && r[t].stop && vt.test(t) && a(r[t]);
        for (t = n.length; t--;) n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o), e = false, n.splice(t, 1));
        !e && o || S.dequeue(this, i);
      });
    }, finish: function (a) {
      return false !== a && (a = a || "fx"), this.each(function () {
        var e, t = Y.get(this), n = t[a + "queue"], r = t[a + "queueHooks"], i = S.timers, o = n ? n.length : 0;
        for (t.finish = true, S.queue(this, a, []), r && r.stop && r.stop.call(this, true), e = i.length; e--;) i[e].elem === this && i[e].queue === a && (i[e].anim.stop(true), i.splice(e, 1));
        for (e = 0; e < o; e++) n[e] && n[e].finish && n[e].finish.call(this);
        delete t.finish;
      });
    }}), S.each(["toggle", "show", "hide"], function (e, r) {
      var i = S.fn[r];
      S.fn[r] = function (e, t, n) {
        return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(xt(r, true), e, t, n);
      };
    }), S.each({slideDown: xt("show"), slideUp: xt("hide"), slideToggle: xt("toggle"), fadeIn: {opacity: "show"}, fadeOut: {opacity: "hide"}, fadeToggle: {opacity: "toggle"}}, function (e, r) {
      S.fn[e] = function (e, t, n) {
        return this.animate(r, e, t, n);
      };
    }), S.timers = [], S.fx.tick = function () {
      var e, t = 0, n = S.timers;
      for (ft = Date.now(); t < n.length; t++) (e = n[t])() || n[t] !== e || n.splice(t--, 1);
      n.length || S.fx.stop(), ft = void 0;
    }, S.fx.timer = function (e) {
      S.timers.push(e), S.fx.start();
    }, S.fx.interval = 13, S.fx.start = function () {
      pt || (pt = true, yt());
    }, S.fx.stop = function () {
      pt = null;
    }, S.fx.speeds = {slow: 600, fast: 200, _default: 400}, S.fn.delay = function (r, e) {
      return r = S.fx && S.fx.speeds[r] || r, e = e || "fx", this.queue(e, function (e, t) {
        var n = C.setTimeout(e, r);
        t.stop = function () {
          C.clearTimeout(n);
        };
      });
    }, dt = E.createElement("input"), ht = E.createElement("select").appendChild(E.createElement("option")), dt.type = "checkbox", m.checkOn = "" !== dt.value, m.optSelected = ht.selected, (dt = E.createElement("input")).value = "t", dt.type = "radio", m.radioValue = "t" === dt.value;
    var Tt, Ct = S.expr.attrHandle;
    S.fn.extend({attr: function (e, t) {
      return $(this, S.attr, e, t, 1 < arguments.length);
    }, removeAttr: function (e) {
      return this.each(function () {
        S.removeAttr(this, e);
      });
    }}), S.extend({attr: function (e, t, n) {
      var r, i, o = e.nodeType;
      if (3 !== o && 8 !== o && 2 !== o) return void 0 === e.getAttribute ? S.prop(e, t, n) : (1 === o && S.isXMLDoc(e) || (i = S.attrHooks[t.toLowerCase()] || (S.expr.match.bool.test(t) ? Tt : void 0)), void 0 !== n ? null === n ? void S.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : !(i && "get" in i && null !== (r = i.get(e, t))) && null == (r = S.find.attr(e, t)) ? void 0 : r);
    }, attrHooks: {type: {set: function (e, t) {
      if (!m.radioValue && "radio" === t && (e.nodeName && e.nodeName.toLowerCase() === "input".toLowerCase())) {
        var n = e.value;
        return e.setAttribute("type", t), n && (e.value = n), t;
      }
    }}}, removeAttr: function (e, t) {
      var n, r = 0, i = t && t.match(P);
      if (i && 1 === e.nodeType) for (; n = i[r++];) e.removeAttribute(n);
    }}), Tt = {set: function (e, t, n) {
      return false === t ? S.removeAttr(e, n) : e.setAttribute(n, n), n;
    }}, S.each(S.expr.match.bool.source.match(/\w+/g), function (e, t) {
      var a = Ct[t] || S.find.attr;
      Ct[t] = function (e, t, n) {
        var r, i, o = t.toLowerCase();
        return n || (i = Ct[o], Ct[o] = r, r = null != a(e, t, n) ? o : null, Ct[o] = i), r;
      };
    });
    var Et = /^(?:input|select|textarea|button)$/i, St = /^(?:a|area)$/i;
    function Nt(e) {
      return Array.isArray(e) ? e : "string" == typeof e && e.match(P) || [];
    }
    S.fn.extend({prop: function (e, t) {
      return $(this, S.prop, e, t, 1 < arguments.length);
    }, removeProp: function (e) {
      return this.each(function () {
        delete this[S.propFix[e] || e];
      });
    }}), S.extend({prop: function (e, t, n) {
      var r, i, o = e.nodeType;
      if (3 !== o && 8 !== o && 2 !== o) return 1 === o && S.isXMLDoc(e) || (t = S.propFix[t] || t, i = S.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t];
    }, propHooks: {tabIndex: {get: function (e) {
      var t = S.find.attr(e, "tabindex");
      return t ? parseInt(t, 10) : Et.test(e.nodeName) || St.test(e.nodeName) && e.href ? 0 : -1;
    }}}, propFix: {for: "htmlFor", class: "className"}}), m.optSelected || (S.propHooks.selected = {get: function (e) {
      var t = e.parentNode;
      return t && t.parentNode && t.parentNode.selectedIndex, null;
    }, set: function (e) {
      var t = e.parentNode;
      t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
    }}), S.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
      S.propFix[this.toLowerCase()] = this;
    }), S.fn.extend({addClass: function (t) {
      var e, n, r, i, o, a, s, u = 0;
      if ("function" == typeof t && "number" != typeof t.nodeType) return this.each(function (e) {
        S(this).addClass(t.call(this, e, this.getAttribute && this.getAttribute("class") || ""));
      });
      if ((e = Nt(t)).length) for (; n = this[u++];) if (i = n.getAttribute && n.getAttribute("class") || "", r = 1 === n.nodeType && " " + (i.match(P) || []).join(" ") + " ") {
        for (a = 0; o = e[a++];) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
        i !== (s = (r.match(P) || []).join(" ")) && n.setAttribute("class", s);
      }
      return this;
    }, removeClass: function (t) {
      var e, n, r, i, o, a, s, u = 0;
      if ("function" == typeof t && "number" != typeof t.nodeType) return this.each(function (e) {
        S(this).removeClass(t.call(this, e, this.getAttribute && this.getAttribute("class") || ""));
      });
      if (!arguments.length) return this.attr("class", "");
      if ((e = Nt(t)).length) for (; n = this[u++];) if (i = n.getAttribute && n.getAttribute("class") || "", r = 1 === n.nodeType && " " + (i.match(P) || []).join(" ") + " ") {
        for (a = 0; o = e[a++];) for (; -1 < r.indexOf(" " + o + " ");) r = r.replace(" " + o + " ", " ");
        i !== (s = (r.match(P) || []).join(" ")) && n.setAttribute("class", s);
      }
      return this;
    }, toggleClass: function (i, t) {
      var o = typeof i, a = "string" == o || Array.isArray(i);
      return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : "function" == typeof i && "number" != typeof i.nodeType ? this.each(function (e) {
        S(this).toggleClass(i.call(this, e, this.getAttribute && this.getAttribute("class") || "", t), t);
      }) : this.each(function () {
        var e, t, n, r;
        if (a) for (t = 0, n = S(this), r = Nt(i); e = r[t++];) n.hasClass(e) ? n.removeClass(e) : n.addClass(e); else void 0 !== i && "boolean" != o || ((e = this.getAttribute && this.getAttribute("class") || "") && Y.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", !e && false !== i && Y.get(this, "__className__") || ""));
      });
    }, hasClass: function (e) {
      for (var t, n = 0, r = " " + e + " "; t = this[n++];) if (1 === t.nodeType && -1 < (" " + ((t.getAttribute && t.getAttribute("class") || "").match(P) || []).join(" ") + " ").indexOf(r)) return true;
      return false;
    }});
    var Dt = /\r/g;
    S.fn.extend({val: function (n) {
      var r, e, i, t = this[0];
      return arguments.length ? (i = "function" == typeof n && "number" != typeof n.nodeType, this.each(function (e) {
        var t;
        1 === this.nodeType && (null == (t = i ? n.call(this, e, S(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = S.map(t, function (e) {
          return null == e ? "" : e + "";
        })), (r = S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]) && "set" in r && void 0 !== r.set(this, t, "value") || (this.value = t));
      })) : t ? (r = S.valHooks[t.type] || S.valHooks[t.nodeName.toLowerCase()]) && "get" in r && void 0 !== (e = r.get(t, "value")) ? e : "string" == typeof (e = t.value) ? e.replace(Dt, "") : null == e ? "" : e : void 0;
    }}), S.extend({valHooks: {option: {get: function (e) {
      var t = S.find.attr(e, "value");
      return null != t ? t : (S.text(e).match(P) || []).join(" ");
    }}, select: {get: function (e) {
      for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type, a = o ? null : [], s = o ? i + 1 : r.length, u = i < 0 ? s : o ? i : 0; u < s; u++) if (((n = r[u]).selected || u === i) && !n.disabled && (!n.parentNode.disabled || !(n.parentNode.nodeName && n.parentNode.nodeName.toLowerCase() === "optgroup".toLowerCase()))) {
        if (t = S(n).val(), o) return t;
        a.push(t);
      }
      return a;
    }, set: function (e, t) {
      for (var n, r, i = e.options, o = S.makeArray(t), a = i.length; a--;) ((r = i[a]).selected = -1 < S.inArray(S.valHooks.option.get(r), o)) && (n = true);
      return n || (e.selectedIndex = -1), o;
    }}}}), S.each(["radio", "checkbox"], function () {
      S.valHooks[this] = {set: function (e, t) {
        if (Array.isArray(t)) return e.checked = -1 < S.inArray(S(e).val(), t);
      }}, m.checkOn || (S.valHooks[this].get = function (e) {
        return null === e.getAttribute("value") ? "on" : e.value;
      });
    }), m.focusin = "onfocusin" in C;
    function jt(e) {
      e.stopPropagation();
    }
    var qt = /^(?:focusinfocus|focusoutblur)$/;
    S.extend(S.event, {trigger: function (e, t, n, r) {
      var i, o, a, s, u, l, c, f = [n || E], p = y.call(e, "type") ? e.type : e, d = y.call(e, "namespace") ? e.namespace.split(".") : [], h = c = o = n = n || E;
      if (3 !== n.nodeType && 8 !== n.nodeType && !qt.test(p + S.event.triggered) && (-1 < p.indexOf(".") && (p = (d = p.split(".")).shift(), d.sort()), s = p.indexOf(":") < 0 && "on" + p, (e = e[S.expando] ? e : new S.Event(p, "object" == typeof e && e)).isTrigger = r ? 2 : 3, e.namespace = d.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = null == t ? [e] : S.makeArray(t, [e]), l = S.event.special[p] || {}, r || !l.trigger || false !== l.trigger.apply(n, t))) {
        if (!r && !l.noBubble && !(null != n && n === n.window)) {
          for (a = l.delegateType || p, qt.test(a + p) || (h = h.parentNode); h; h = h.parentNode) f.push(h), o = h;
          o === (n.ownerDocument || E) && f.push(o.defaultView || o.parentWindow || C);
        }
        for (i = 0; (h = f[i++]) && !e.isPropagationStopped();) c = h, e.type = 1 < i ? a : l.bindType || p, (u = (Y.get(h, "events") || Object.create(null))[e.type] && Y.get(h, "handle")) && u.apply(h, t), (u = s && h[s]) && u.apply && (1 === h.nodeType || 9 === h.nodeType || !+h.nodeType) && (e.result = u.apply(h, t), false === e.result && e.preventDefault());
        return e.type = p, r || e.isDefaultPrevented() || l._default && false !== l._default.apply(f.pop(), t) || !(1 === n.nodeType || 9 === n.nodeType || !+n.nodeType) || s && ("function" == typeof n[p] && "number" != typeof n[p].nodeType) && !(null != n && n === n.window) && ((o = n[s]) && (n[s] = null), S.event.triggered = p, e.isPropagationStopped() && c.addEventListener(p, jt), n[p](), e.isPropagationStopped() && c.removeEventListener(p, jt), S.event.triggered = void 0, o && (n[s] = o)), e.result;
      }
    }, simulate: function (e, t, n) {
      var r = S.extend(new S.Event, n, {type: e, isSimulated: true});
      S.event.trigger(r, null, t);
    }}), S.fn.extend({trigger: function (e, t) {
      return this.each(function () {
        S.event.trigger(e, t, this);
      });
    }, triggerHandler: function (e, t) {
      var n = this[0];
      if (n) return S.event.trigger(e, t, n, true);
    }}), m.focusin || S.each({focus: "focusin", blur: "focusout"}, function (n, r) {
      function i(e) {
        S.event.simulate(r, e.target, S.event.fix(e));
      }
      S.event.special[r] = {setup: function () {
        var e = this.ownerDocument || this.document || this, t = Y.access(e, r);
        t || e.addEventListener(n, i, true), Y.access(e, r, (t || 0) + 1);
      }, teardown: function () {
        var e = this.ownerDocument || this.document || this, t = Y.access(e, r) - 1;
        t ? Y.access(e, r, t) : (e.removeEventListener(n, i, true), Y.remove(e, r));
      }};
    });
    var Lt = C.location, Ht = {guid: Date.now()}, Ot = /\?/;
    S.parseXML = function (e) {
      var t;
      if (!e || "string" != typeof e) return null;
      try {
        t = (new C.DOMParser).parseFromString(e, "text/xml");
      } catch (e) {
        t = void 0;
      }
      return t && !t.getElementsByTagName("parsererror").length || S.error("Invalid XML: " + e), t;
    };
    var Pt = /\[\]$/, Rt = /\r?\n/g, Mt = /^(?:submit|button|image|reset|file)$/i, It = /^(?:input|select|textarea|keygen)/i;
    S.param = function (e, t) {
      function n(e, t) {
        var n = "function" == typeof t && "number" != typeof t.nodeType ? t() : t;
        i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n);
      }
      var r, i = [];
      if (null == e) return "";
      if (Array.isArray(e) || e.jquery && !S.isPlainObject(e)) S.each(e, function () {
        n(this.name, this.value);
      }); else for (r in e) !function n(r, e, i, o) {
        var t;
        if (Array.isArray(e)) S.each(e, function (e, t) {
          i || Pt.test(r) ? o(r, t) : n(r + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, i, o);
        }); else if (i || "object" !== w(e)) o(r, e); else for (t in e) n(r + "[" + t + "]", e[t], i, o);
      }(r, e[r], t, n);
      return i.join("&");
    }, S.fn.extend({serialize: function () {
      return S.param(this.serializeArray());
    }, serializeArray: function () {
      return this.map(function () {
        var e = S.prop(this, "elements");
        return e ? S.makeArray(e) : this;
      }).filter(function () {
        var e = this.type;
        return this.name && !S(this).is(":disabled") && It.test(this.nodeName) && !Mt.test(e) && (this.checked || !pe.test(e));
      }).map(function (e, t) {
        var n = S(this).val();
        return null == n ? null : Array.isArray(n) ? S.map(n, function (e) {
          return {name: t.name, value: e.replace(Rt, "\r\n")};
        }) : {name: t.name, value: n.replace(Rt, "\r\n")};
      }).get();
    }});
    var Wt = /%20/g, Ft = /#.*$/, Bt = /([?&])_=[^&]*/, $t = /^(.*?):[ \t]*([^\r\n]*)$/gm, _t = /^(?:GET|HEAD)$/, zt = /^\/\//, Ut = {}, Xt = {}, Vt = "*/".concat("*"), Gt = E.createElement("a");
    function Yt(o) {
      return function (e, t) {
        "string" != typeof e && (t = e, e = "*");
        var n, r = 0, i = e.toLowerCase().match(P) || [];
        if ("function" == typeof t && "number" != typeof t.nodeType) for (; n = i[r++];) "+" === n[0] ? (n = n.slice(1) || "*", (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t);
      };
    }
    function Qt(t, i, o, a) {
      var s = {}, u = t === Xt;
      function l(e) {
        var r;
        return s[e] = true, S.each(t[e] || [], function (e, t) {
          var n = t(i, o, a);
          return "string" != typeof n || u || s[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n), l(n), false);
        }), r;
      }
      return l(i.dataTypes[0]) || !s["*"] && l("*");
    }
    function Jt(e, t) {
      var n, r, i = S.ajaxSettings.flatOptions || {};
      for (n in t) void 0 !== t[n] && ((i[n] ? e : r = r || {})[n] = t[n]);
      return r && S.extend(true, e, r), e;
    }
    Gt.href = Lt.href, S.extend({active: 0, lastModified: {}, etag: {}, ajaxSettings: {url: Lt.href, type: "GET", isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Lt.protocol), global: true, processData: true, async: true, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: {"*": Vt, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript"}, contents: {xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/}, responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"}, converters: {"* text": String, "text html": true, "text json": JSON.parse, "text xml": S.parseXML}, flatOptions: {url: true, context: true}}, ajaxSetup: function (e, t) {
      return t ? Jt(Jt(e, S.ajaxSettings), t) : Jt(S.ajaxSettings, e);
    }, ajaxPrefilter: Yt(Ut), ajaxTransport: Yt(Xt), ajax: function (e, t) {
      "object" == typeof e && (t = e, e = void 0), t = t || {};
      var c, f, p, n, d, r, h, g, i, o, v = S.ajaxSetup({}, t), y = v.context || v, m = v.context && (y.nodeType || y.jquery) ? S(y) : S.event, x = S.Deferred(), b = S.Callbacks("once memory"), w = v.statusCode || {}, a = {}, s = {}, u = "canceled", T = {readyState: 0, getResponseHeader: function (e) {
        var t;
        if (h) {
          if (!n) for (n = {}; t = $t.exec(p);) n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2]);
          t = n[e.toLowerCase() + " "];
        }
        return null == t ? null : t.join(", ");
      }, getAllResponseHeaders: function () {
        return h ? p : null;
      }, setRequestHeader: function (e, t) {
        return null == h && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e, a[e] = t), this;
      }, overrideMimeType: function (e) {
        return null == h && (v.mimeType = e), this;
      }, statusCode: function (e) {
        var t;
        if (e) if (h) T.always(e[T.status]); else for (t in e) w[t] = [w[t], e[t]];
        return this;
      }, abort: function (e) {
        var t = e || u;
        return c && c.abort(t), l(0, t), this;
      }};
      if (x.promise(T), v.url = ((e || v.url || Lt.href) + "").replace(zt, Lt.protocol + "//"), v.type = t.method || t.type || v.method || v.type, v.dataTypes = (v.dataType || "*").toLowerCase().match(P) || [""], null == v.crossDomain) {
        r = E.createElement("a");
        try {
          r.href = v.url, r.href = r.href, v.crossDomain = Gt.protocol + "//" + Gt.host != r.protocol + "//" + r.host;
        } catch (e) {
          v.crossDomain = true;
        }
      }
      if (v.data && v.processData && "string" != typeof v.data && (v.data = S.param(v.data, v.traditional)), Qt(Ut, v, t, T), h) return T;
      for (i in (g = S.event && v.global) && 0 == S.active++ && S.event.trigger("ajaxStart"), v.type = v.type.toUpperCase(), v.hasContent = !_t.test(v.type), f = v.url.replace(Ft, ""), v.hasContent ? v.data && v.processData && 0 === (v.contentType || "").indexOf("application/x-www-form-urlencoded") && (v.data = v.data.replace(Wt, "+")) : (o = v.url.slice(f.length), v.data && (v.processData || "string" == typeof v.data) && (f += (Ot.test(f) ? "&" : "?") + v.data, delete v.data), false === v.cache && (f = f.replace(Bt, "$1"), o = (Ot.test(f) ? "&" : "?") + "_=" + Ht.guid++ + o), v.url = f + o), v.ifModified && (S.lastModified[f] && T.setRequestHeader("If-Modified-Since", S.lastModified[f]), S.etag[f] && T.setRequestHeader("If-None-Match", S.etag[f])), (v.data && v.hasContent && false !== v.contentType || t.contentType) && T.setRequestHeader("Content-Type", v.contentType), T.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + Vt + "; q=0.01" : "") : v.accepts["*"]), v.headers) T.setRequestHeader(i, v.headers[i]);
      if (v.beforeSend && (false === v.beforeSend.call(y, T, v) || h)) return T.abort();
      if (u = "abort", b.add(v.complete), T.done(v.success), T.fail(v.error), c = Qt(Xt, v, t, T)) {
        if (T.readyState = 1, g && m.trigger("ajaxSend", [T, v]), h) return T;
        v.async && 0 < v.timeout && (d = C.setTimeout(function () {
          T.abort("timeout");
        }, v.timeout));
        try {
          h = false, c.send(a, l);
        } catch (e) {
          if (h) throw e;
          l(-1, e);
        }
      } else l(-1, "No Transport");
      function l(e, t, n, r) {
        var i, o, a, s, u, l = t;
        h || (h = true, d && C.clearTimeout(d), c = void 0, p = r || "", T.readyState = 0 < e ? 4 : 0, i = 200 <= e && e < 300 || 304 === e, n && (s = function (e, t, n) {
          for (var r, i, o, a, s = e.contents, u = e.dataTypes; "*" === u[0];) u.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
          if (r) for (i in s) if (s[i] && s[i].test(r)) {
            u.unshift(i);
            break;
          }
          if (u[0] in n) o = u[0]; else {
            for (i in n) {
              if (!u[0] || e.converters[i + " " + u[0]]) {
                o = i;
                break;
              }
              a = a || i;
            }
            o = o || a;
          }
          if (o) return o !== u[0] && u.unshift(o), n[o];
        }(v, T, n)), !i && -1 < S.inArray("script", v.dataTypes) && (v.converters["text script"] = function () {}), s = function (e, t, n, r) {
          var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
          if (c[1]) for (a in e.converters) l[a.toLowerCase()] = e.converters[a];
          for (o = c.shift(); o;) if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = c.shift()) if ("*" === o) o = u; else if ("*" !== u && u !== o) {
            if (!(a = l[u + " " + o] || l["* " + o])) for (i in l) if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
              true === a ? a = l[i] : true !== l[i] && (o = s[0], c.unshift(s[1]));
              break;
            }
            if (true !== a) if (a && e.throws) t = a(t); else try {
              t = a(t);
            } catch (e) {
              return {state: "parsererror", error: a ? e : "No conversion from " + u + " to " + o};
            }
          }
          return {state: "success", data: t};
        }(v, s, T, i), i ? (v.ifModified && ((u = T.getResponseHeader("Last-Modified")) && (S.lastModified[f] = u), (u = T.getResponseHeader("etag")) && (S.etag[f] = u)), 204 === e || "HEAD" === v.type ? l = "nocontent" : 304 === e ? l = "notmodified" : (l = s.state, o = s.data, i = !(a = s.error))) : (a = l, !e && l || (l = "error", e < 0 && (e = 0))), T.status = e, T.statusText = (t || l) + "", i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]), T.statusCode(w), w = void 0, g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]), b.fireWith(y, [T, l]), g && (m.trigger("ajaxComplete", [T, v]), --S.active || S.event.trigger("ajaxStop")));
      }
      return T;
    }, getJSON: function (e, t, n) {
      return S.get(e, t, n, "json");
    }, getScript: function (e, t) {
      return S.get(e, void 0, t, "script");
    }}), S.each(["get", "post"], function (e, i) {
      S[i] = function (e, t, n, r) {
        return "function" == typeof t && "number" != typeof t.nodeType && (r = r || n, n = t, t = void 0), S.ajax(S.extend({url: e, type: i, dataType: r, data: t, success: n}, S.isPlainObject(e) && e));
      };
    }), S.ajaxPrefilter(function (e) {
      var t;
      for (t in e.headers) "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "");
    }), S._evalUrl = function (e, t, n) {
      return S.ajax({url: e, type: "GET", dataType: "script", cache: true, async: false, global: false, converters: {"text script": function () {}}, dataFilter: function (e) {
        S.globalEval(e, t, n);
      }});
    }, S.fn.extend({wrapAll: function (e) {
      var t;
      return this[0] && ("function" == typeof e && "number" != typeof e.nodeType && (e = e.call(this[0])), t = S(e, this[0].ownerDocument).eq(0).clone(true), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
        for (var e = this; e.firstElementChild;) e = e.firstElementChild;
        return e;
      }).append(this)), this;
    }, wrapInner: function (n) {
      return "function" == typeof n && "number" != typeof n.nodeType ? this.each(function (e) {
        S(this).wrapInner(n.call(this, e));
      }) : this.each(function () {
        var e = S(this), t = e.contents();
        t.length ? t.wrapAll(n) : e.append(n);
      });
    }, wrap: function (t) {
      var n = "function" == typeof t && "number" != typeof t.nodeType;
      return this.each(function (e) {
        S(this).wrapAll(n ? t.call(this, e) : t);
      });
    }, unwrap: function (e) {
      return this.parent(e).not("body").each(function () {
        S(this).replaceWith(this.childNodes);
      }), this;
    }}), S.expr.pseudos.hidden = function (e) {
      return !S.expr.pseudos.visible(e);
    }, S.expr.pseudos.visible = function (e) {
      return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    }, S.ajaxSettings.xhr = function () {
      try {
        return new C.XMLHttpRequest;
      } catch (e) {}
    };
    var Kt = {0: 200, 1223: 204}, Zt = S.ajaxSettings.xhr();
    m.cors = !!Zt && "withCredentials" in Zt, m.ajax = Zt = !!Zt, S.ajaxTransport(function (i) {
      var o, a;
      if (m.cors || Zt && !i.crossDomain) return {send: function (e, t) {
        var n, r = i.xhr();
        if (r.open(i.type, i.url, i.async, i.username, i.password), i.xhrFields) for (n in i.xhrFields) r[n] = i.xhrFields[n];
        for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType), i.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"), e) r.setRequestHeader(n, e[n]);
        o = function (e) {
          return function () {
            o && (o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null, "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(Kt[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {binary: r.response} : {text: r.responseText}, r.getAllResponseHeaders()));
          };
        }, r.onload = o(), a = r.onerror = r.ontimeout = o("error"), void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function () {
          4 === r.readyState && C.setTimeout(function () {
            o && a();
          });
        }, o = o("abort");
        try {
          r.send(i.hasContent && i.data || null);
        } catch (e) {
          if (o) throw e;
        }
      }, abort: function () {
        o && o();
      }};
    }), S.ajaxPrefilter(function (e) {
      e.crossDomain && (e.contents.script = false);
    }), S.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents: {script: /\b(?:java|ecma)script\b/}, converters: {"text script": function (e) {
      return S.globalEval(e), e;
    }}}), S.ajaxPrefilter("script", function (e) {
      void 0 === e.cache && (e.cache = false), e.crossDomain && (e.type = "GET");
    }), S.ajaxTransport("script", function (n) {
      var r, i;
      if (n.crossDomain || n.scriptAttrs) return {send: function (e, t) {
        r = S("<script>").attr(n.scriptAttrs || {}).prop({charset: n.scriptCharset, src: n.url}).on("load error", i = function (e) {
          r.remove(), i = null, e && t("error" === e.type ? 404 : 200, e.type);
        }), E.head.appendChild(r[0]);
      }, abort: function () {
        i && i();
      }};
    });
    var en, tn = [], nn = /(=)\?(?=&|$)|\?\?/;
    S.ajaxSetup({jsonp: "callback", jsonpCallback: function () {
      var e = tn.pop() || S.expando + "_" + Ht.guid++;
      return this[e] = true, e;
    }}), S.ajaxPrefilter("json jsonp", function (e, t, n) {
      var r, i, o, a = false !== e.jsonp && (nn.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && nn.test(e.data) && "data");
      if (a || "jsonp" === e.dataTypes[0]) return r = e.jsonpCallback = "function" == typeof e.jsonpCallback && "number" != typeof e.jsonpCallback.nodeType ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(nn, "$1" + r) : false !== e.jsonp && (e.url += (Ot.test(e.url) ? "&" : "?") + e.jsonp + "=" + r), e.converters["script json"] = function () {
        return o || S.error(r + " was not called"), o[0];
      }, e.dataTypes[0] = "json", i = C[r], C[r] = function () {
        o = arguments;
      }, n.always(function () {
        void 0 === i ? S(C).removeProp(r) : C[r] = i, e[r] && (e.jsonpCallback = t.jsonpCallback, tn.push(r)), o && ("function" == typeof i && "number" != typeof i.nodeType) && i(o[0]), o = i = void 0;
      }), "script";
    }), m.createHTMLDocument = ((en = E.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === en.childNodes.length), S.parseHTML = function (e, t, n) {
      return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = false), t || (m.createHTMLDocument ? ((r = (t = E.implementation.createHTMLDocument("")).createElement("base")).href = E.location.href, t.head.appendChild(r)) : t = E), o = !n && [], (i = N.exec(e)) ? [t.createElement(i[1])] : (i = xe([e], t, o), o && o.length && S(o).remove(), S.merge([], i.childNodes)));
      var r, i, o;
    }, S.fn.load = function (e, t, n) {
      var r, i, o, a = this, s = e.indexOf(" ");
      return -1 < s && (r = (e.slice(s).match(P) || []).join(" "), e = e.slice(0, s)), "function" == typeof t && "number" != typeof t.nodeType ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), 0 < a.length && S.ajax({url: e, type: i || "GET", dataType: "html", data: t}).done(function (e) {
        o = arguments, a.html(r ? S("<div>").append(S.parseHTML(e)).find(r) : e);
      }).always(n && function (e, t) {
        a.each(function () {
          n.apply(this, o || [e.responseText, t, e]);
        });
      }), this;
    }, S.expr.pseudos.animated = function (t) {
      return S.grep(S.timers, function (e) {
        return t === e.elem;
      }).length;
    }, S.offset = {setOffset: function (e, t, n) {
      var r, i, o, a, s, u, l = S.css(e, "position"), c = S(e), f = {};
      "static" === l && (e.style.position = "relative"), s = c.offset(), o = S.css(e, "top"), u = S.css(e, "left"), i = ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto") ? (a = (r = c.position()).top, r.left) : (a = parseFloat(o) || 0, parseFloat(u) || 0), "function" == typeof t && "number" != typeof t.nodeType && (t = t.call(e, n, S.extend({}, s))), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), "using" in t ? t.using.call(e, f) : ("number" == typeof f.top && (f.top += "px"), "number" == typeof f.left && (f.left += "px"), c.css(f));
    }}, S.fn.extend({offset: function (t) {
      if (arguments.length) return void 0 === t ? this : this.each(function (e) {
        S.offset.setOffset(this, t, e);
      });
      var e, n, r = this[0];
      return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {top: e.top + n.pageYOffset, left: e.left + n.pageXOffset}) : {top: 0, left: 0} : void 0;
    }, position: function () {
      if (this[0]) {
        var e, t, n, r = this[0], i = {top: 0, left: 0};
        if ("fixed" === S.css(r, "position")) t = r.getBoundingClientRect(); else {
          for (t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === S.css(e, "position");) e = e.parentNode;
          e && e !== r && 1 === e.nodeType && ((i = S(e).offset()).top += S.css(e, "borderTopWidth", true), i.left += S.css(e, "borderLeftWidth", true));
        }
        return {top: t.top - i.top - S.css(r, "marginTop", true), left: t.left - i.left - S.css(r, "marginLeft", true)};
      }
    }, offsetParent: function () {
      return this.map(function () {
        for (var e = this.offsetParent; e && "static" === S.css(e, "position");) e = e.offsetParent;
        return e || re;
      });
    }}), S.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (t, i) {
      var o = "pageYOffset" === i;
      S.fn[t] = function (e) {
        return $(this, function (e, t, n) {
          var r;
          return null != e && e === e.window ? r = e : 9 === e.nodeType && (r = e.defaultView), void 0 === n ? r ? r[i] : e[t] : void (r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n);
        }, t, e, arguments.length);
      };
    }), S.each(["top", "left"], function (e, n) {
      S.cssHooks[n] = Ke(m.pixelPosition, function (e, t) {
        if (t) return t = Je(e, n), Xe.test(t) ? S(e).position()[n] + "px" : t;
      });
    }), S.each({Height: "height", Width: "width"}, function (a, s) {
      S.each({padding: "inner" + a, content: s, "": "outer" + a}, function (r, o) {
        S.fn[o] = function (e, t) {
          var n = arguments.length && (r || "boolean" != typeof e), i = r || (true === e || true === t ? "margin" : "border");
          return $(this, function (e, t, n) {
            var r;
            return null != e && e === e.window ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement, Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : void 0 === n ? S.css(e, t, i) : S.style(e, t, n, i);
          }, s, n ? e : void 0, n);
        };
      });
    }), S.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
      S.fn[t] = function (e) {
        return this.on(t, e);
      };
    }), S.fn.extend({bind: function (e, t, n) {
      return this.on(e, null, t, n);
    }, unbind: function (e, t) {
      return this.off(e, null, t);
    }, delegate: function (e, t, n, r) {
      return this.on(t, e, n, r);
    }, undelegate: function (e, t, n) {
      return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n);
    }, hover: function (e, t) {
      return this.mouseenter(e).mouseleave(t || e);
    }}), S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (e, n) {
      S.fn[n] = function (e, t) {
        return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n);
      };
    });
    var rn = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    S.proxy = function (e, t) {
      var n, r, i;
      if ("string" == typeof t && (n = e[t], t = e, e = n), "function" == typeof e && "number" != typeof e.nodeType) return r = s.call(arguments, 2), (i = function () {
        return e.apply(t || this, r.concat(s.call(arguments)));
      }).guid = e.guid = e.guid || S.guid++, i;
    }, S.holdReady = function (e) {
      e ? S.readyWait++ : S.ready(true);
    }, S.isArray = Array.isArray, S.parseJSON = JSON.parse, S.nodeName = A, S.isFunction = x, S.isWindow = g, S.camelCase = X, S.type = w, S.now = Date.now, S.isNumeric = function (e) {
      var t = S.type(e);
      return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
    }, S.trim = function (e) {
      return null == e ? "" : (e + "").replace(rn, "");
    }, "function" == typeof define && define.amd && define("jquery", [], function () {
      return S;
    });
    var on = C.jQuery, an = C.$;
    return S.noConflict = function (e) {
      return C.$ === S && (C.$ = an), e && C.jQuery === S && (C.jQuery = on), S;
    }, void 0 === e && (C.jQuery = C.$ = S), S;
  });
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Popper = t();
  }(this, function () {
    "use strict";
    var n = "undefined" != typeof window && "undefined" != typeof document && "undefined" != typeof navigator, o = function () {
      for (var e = ["Edge", "Trident", "Firefox"], t = 0; t < e.length; t += 1) if (n && 0 <= navigator.userAgent.indexOf(e[t])) return 1;
      return 0;
    }();
    var i = n && window.Promise ? function (e) {
      var t = false;
      return function () {
        t || (t = true, window.Promise.resolve().then(function () {
          t = false, (t && p(e.prototype, t), n && p(e, n), e);
        }));
      };
    } : function (e) {
      var t = false;
      return function () {
        t || (t = true, setTimeout(function () {
          t = false, (t && p(e.prototype, t), n && p(e, n), e);
        }, o));
      };
    };
    function y(e, t) {
      if (1 !== e.nodeType) return [];
      var n = e.ownerDocument.defaultView.getComputedStyle(e, null);
      return t ? n[t] : n;
    }
    function h(e) {
      return "HTML" === e.nodeName ? e : e.parentNode || e.host;
    }
    function m(e) {
      if (!e) return document.body;
      switch (e.nodeName) {
        case "HTML":
        case "BODY":
          return e.ownerDocument.body;
        case "#document":
          return e.body;
      }
      var t = y(e), n = t.overflow, o = t.overflowX, r = t.overflowY;
      return /(auto|scroll|overlay)/.test(n + r + o) ? e : m(h(e));
    }
    function g(e) {
      return e && e.referenceNode ? e.referenceNode : e;
    }
    var t = n && !(!window.MSInputMethodContext || !document.documentMode), r = n && /MSIE 10/.test(navigator.userAgent);
    function v(e) {
      return 11 === e ? t : 10 !== e && t || r;
    }
    function w(e) {
      if (!e) return document.documentElement;
      for (var t = v(10) ? document.body : null, n = e.offsetParent || null; n === t && e.nextElementSibling;) n = (e = e.nextElementSibling).offsetParent;
      var o = n && n.nodeName;
      return o && "BODY" !== o && "HTML" !== o ? -1 !== ["TH", "TD", "TABLE"].indexOf(n.nodeName) && "static" === y(n, "position") ? w(n) : n : e ? e.ownerDocument.documentElement : document.documentElement;
    }
    function l(e) {
      return null !== e.parentNode ? l(e.parentNode) : e;
    }
    function b(e, t) {
      if (!(e && e.nodeType && t && t.nodeType)) return document.documentElement;
      var n = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING, o = n ? e : t, r = n ? t : e, i = document.createRange();
      i.setStart(o, 0), i.setEnd(r, 0);
      var a, s, f = i.commonAncestorContainer;
      if (e !== f && t !== f || o.contains(r)) return "BODY" === (s = (a = f).nodeName) || "HTML" !== s && w(a.firstElementChild) !== a ? w(f) : f;
      var p = l(e);
      return p.host ? b(p.host, t) : b(e, l(t).host);
    }
    function x(e, t) {
      var n = "top" === (1 < arguments.length && void 0 !== t ? t : "top") ? "scrollTop" : "scrollLeft", o = e.nodeName;
      if ("BODY" !== o && "HTML" !== o) return e[n];
      var r = e.ownerDocument.documentElement;
      return (e.ownerDocument.scrollingElement || r)[n];
    }
    function d(e, t) {
      var n = "x" === t ? "Left" : "Top", o = "Left" == n ? "Right" : "Bottom";
      return parseFloat(e["border" + n + "Width"]) + parseFloat(e["border" + o + "Width"]);
    }
    function E(e) {
      var t = e.body, n = e.documentElement, o = v(10) && getComputedStyle(n);
      return {height: Math.max(t.offsetHeight, t.scrollHeight, n.clientHeight, n.offsetHeight, n.scrollHeight, v(10) ? parseInt(n.offsetHeight) + parseInt(o["margin" + "Top"]) + parseInt(o["margin" + "Bottom"]) : 0), width: Math.max(t.offsetWidth, t.scrollWidth, n.clientWidth, n.offsetWidth, n.scrollWidth, v(10) ? parseInt(n.offsetWidth) + parseInt(o["margin" + "Left"]) + parseInt(o["margin" + "Right"]) : 0)};
    }
    var f = function (e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    };
    function p(e, t) {
      for (var n = 0; n < t.length; n++) {
        var o = t[n];
        o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, o.key, o);
      }
    }
    var L = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
      }
      return e;
    };
    function D(e) {
      var t, n, o = {};
      try {
        v(10) ? (o = e.getBoundingClientRect(), t = x(e, "top"), n = x(e, "left"), o.top += t, o.left += n, o.bottom += t, o.right += n) : o = e.getBoundingClientRect();
      } catch (e) {}
      var r, i = {left: o.left, top: o.top, width: o.right - o.left, height: o.bottom - o.top}, a = "HTML" === e.nodeName ? E(e.ownerDocument) : {}, s = a.width || e.clientWidth || i.width, f = a.height || e.clientHeight || i.height, p = e.offsetWidth - s, l = e.offsetHeight - f;
      return (p || l) && (p -= d(r = y(e), "x"), l -= d(r, "y"), i.width -= p, i.height -= l), L({}, i, {right: i.left + i.width, bottom: i.top + i.height});
    }
    function M(e, t, n) {
      var o = 2 < arguments.length && void 0 !== n && n, r = v(10), i = "HTML" === t.nodeName, a = D(e), s = D(t), f = m(e), p = y(t), l = parseFloat(p.borderTopWidth), d = parseFloat(p.borderLeftWidth);
      o && i && (s.top = Math.max(s.top, 0), s.left = Math.max(s.left, 0));
      var u, c, h = L({}, {top: a.top - s.top - l, left: a.left - s.left - d, width: a.width, height: a.height}, {right: {top: a.top - s.top - l, left: a.left - s.left - d, width: a.width, height: a.height}.left + {top: a.top - s.top - l, left: a.left - s.left - d, width: a.width, height: a.height}.width, bottom: {top: a.top - s.top - l, left: a.left - s.left - d, width: a.width, height: a.height}.top + {top: a.top - s.top - l, left: a.left - s.left - d, width: a.width, height: a.height}.height});
      return h.marginTop = 0, h.marginLeft = 0, !r && i && (u = parseFloat(p.marginTop), c = parseFloat(p.marginLeft), h.top -= l - u, h.bottom -= l - u, h.left -= d - c, h.right -= d - c, h.marginTop = u, h.marginLeft = c), (r && !o ? t.contains(f) : t === f && "BODY" !== f.nodeName) && (h = function (e, t, n) {
        var o = 2 < arguments.length && void 0 !== n && n, r = x(t, "top"), i = x(t, "left"), a = o ? -1 : 1;
        return e.top += r * a, e.bottom += r * a, e.left += i * a, e.right += i * a, e;
      }(h, t)), h;
    }
    function N(e) {
      if (!e || !e.parentElement || v()) return document.documentElement;
      for (var t = e.parentElement; t && "none" === y(t, "transform");) t = t.parentElement;
      return t || document.documentElement;
    }
    function c(e, t, n, o, r) {
      var i, a, s, f, p, l = 4 < arguments.length && void 0 !== r && r, d = {top: 0, left: 0}, u = l ? N(e) : b(e, g(t));
      "viewport" === o ? d = function (e, t) {
        var n = 1 < arguments.length && void 0 !== t && t, o = e.ownerDocument.documentElement, r = M(e, o), i = Math.max(o.clientWidth, window.innerWidth || 0), a = Math.max(o.clientHeight, window.innerHeight || 0), s = n ? 0 : x(o), f = n ? 0 : x(o, "left");
        return L({}, {top: s - r.top + r.marginTop, left: f - r.left + r.marginLeft, width: i, height: a}, {right: {top: s - r.top + r.marginTop, left: f - r.left + r.marginLeft, width: i, height: a}.left + {top: s - r.top + r.marginTop, left: f - r.left + r.marginLeft, width: i, height: a}.width, bottom: {top: s - r.top + r.marginTop, left: f - r.left + r.marginLeft, width: i, height: a}.top + {top: s - r.top + r.marginTop, left: f - r.left + r.marginLeft, width: i, height: a}.height});
      }(u, l) : (i = void 0, "scrollParent" === o ? "BODY" === (i = m(h(t))).nodeName && (i = e.ownerDocument.documentElement) : i = "window" === o ? e.ownerDocument.documentElement : o, a = M(i, u, l), "HTML" !== i.nodeName || function e(t) {
        var n = t.nodeName;
        if ("BODY" === n || "HTML" === n) return false;
        if ("fixed" === y(t, "position")) return true;
        var o = h(t);
        return !!o && (t && p(o.prototype, t), n && p(o, n), o);
      }(u) ? d = a : (f = (s = E(e.ownerDocument)).height, p = s.width, d.top += a.top - a.marginTop, d.bottom = f + a.top, d.left += a.left - a.marginLeft, d.right = p + a.left));
      var c = "number" == typeof (n = n || 0);
      return d.left += c ? n : n.left || 0, d.top += c ? n : n.top || 0, d.right -= c ? n : n.right || 0, d.bottom -= c ? n : n.bottom || 0, d;
    }
    function u(e, t, o, n, r, i) {
      var a = 5 < arguments.length && void 0 !== i ? i : 0;
      if (-1 === e.indexOf("auto")) return e;
      var s = c(o, n, a, r), f = {top: {width: s.width, height: t.top - s.top}, right: {width: s.right - t.right, height: s.height}, bottom: {width: s.width, height: s.bottom - t.bottom}, left: {width: t.left - s.left, height: s.height}}, p = Object.keys(f).map(function (e) {
        return L({key: e}, f[e], {area: (t = f[e]).width * t.height});
        var t;
      }).sort(function (e, t) {
        return t.area - e.area;
      }), l = p.filter(function (e) {
        var t = e.width, n = e.height;
        return t >= o.clientWidth && n >= o.clientHeight;
      }), d = 0 < l.length ? l[0].key : p[0].key, u = e.split("-")[1];
      return d + (u ? "-" + u : "");
    }
    function F(e, t, n, o) {
      var r = 3 < arguments.length && void 0 !== o ? o : null;
      return M(n, r ? N(t) : b(t, g(n)), r);
    }
    function k(e) {
      var t = e.ownerDocument.defaultView.getComputedStyle(e), n = parseFloat(t.marginTop || 0) + parseFloat(t.marginBottom || 0), o = parseFloat(t.marginLeft || 0) + parseFloat(t.marginRight || 0);
      return {width: e.offsetWidth + o, height: e.offsetHeight + n};
    }
    function H(e) {
      var t = {left: "right", right: "left", bottom: "top", top: "bottom"};
      return e.replace(/left|right|bottom|top/g, function (e) {
        return t[e];
      });
    }
    function C(e, t, n) {
      n = n.split("-")[0];
      var o = k(e), r = {width: o.width, height: o.height}, i = -1 !== ["right", "left"].indexOf(n), a = i ? "top" : "left", s = i ? "left" : "top", f = i ? "height" : "width", p = i ? "width" : "height";
      return r[a] = t[a] + t[f] / 2 - o[f] / 2, r[s] = n === s ? t[s] - o[p] : t[H(s)], r;
    }
    function B(e, t) {
      return Array.prototype.find ? e.find(t) : e.filter(t)[0];
    }
    function A(e, n, t) {
      return (void 0 === t ? e : e.slice(0, function (e, t, n) {
        if (Array.prototype.findIndex) return e.findIndex(function (e) {
          return e[t] === n;
        });
        var o = B(e, function (e) {
          return e[t] === n;
        });
        return e.indexOf(o);
      }(e, "name", t))).forEach(function (e) {
        e.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
        var t = e.function || e.fn;
        e.enabled && (t && "[object Function]" === {}.toString.call(t)) && (n.offsets.popper = L({}, n.offsets.popper, {right: n.offsets.popper.left + n.offsets.popper.width, bottom: n.offsets.popper.top + n.offsets.popper.height}), n.offsets.reference = L({}, n.offsets.reference, {right: n.offsets.reference.left + n.offsets.reference.width, bottom: n.offsets.reference.top + n.offsets.reference.height}), n = t(n, e));
      }), n;
    }
    function P(e, n) {
      return e.some(function (e) {
        var t = e.name;
        return e.enabled && t === n;
      });
    }
    function S(e) {
      for (var t = [false, "ms", "Webkit", "Moz", "O"], n = e.charAt(0).toUpperCase() + e.slice(1), o = 0; o < t.length; o++) {
        var r = t[o], i = r ? "" + r + n : e;
        if (void 0 !== document.body.style[i]) return i;
      }
      return null;
    }
    function W(e) {
      var t = e.ownerDocument;
      return t ? t.defaultView : window;
    }
    function j(e, t, n, o) {
      n.updateBound = o, W(e).addEventListener("resize", n.updateBound, {passive: true});
      var r = m(e);
      return function e(t, n, o, r) {
        var i = "BODY" === t.nodeName, a = i ? t.ownerDocument.defaultView : t;
        a.addEventListener(n, o, {passive: true}), i || (n && p(m(a.parentNode).prototype, n), o && p(m(a.parentNode), o), m(a.parentNode)), r.push(a);
      }(r, "scroll", n.updateBound, n.scrollParents), n.scrollElement = r, n.eventsEnabled = true, n;
    }
    function I() {
      var e, t;
      this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = (e = this.reference, t = this.state, W(e).removeEventListener("resize", t.updateBound), t.scrollParents.forEach(function (e) {
        e.removeEventListener("scroll", t.updateBound);
      }), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = false, t));
    }
    function U(n, o) {
      Object.keys(o).forEach(function (e) {
        var t = "";
        -1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(e) && ("" !== o[e] && !isNaN(parseFloat(o[e])) && isFinite(o[e])) && (t = "px"), n.style[e] = o[e] + t;
      });
    }
    function Y(e, t) {
      var o = e.offsets, r = o.popper, i = o.reference, a = Math.round, s = Math.floor, f = i.width && "[object Function]" === {}.toString.call(i.width), p = r.width && "[object Function]" === {}.toString.call(r.width), l = -1 !== ["left", "right"].indexOf(e.placement), d = -1 !== e.placement.indexOf("-"), u = t ? l || d || f % 2 == p % 2 ? a : s : n, c = t ? a : n;
      return {left: u(f % 2 == 1 && p % 2 == 1 && !d && t ? r.left - 1 : r.left), top: c(r.top), bottom: c(r.bottom), right: u(r.right)};
    }
    var V = n && /Firefox/i.test(navigator.userAgent);
    function q(e, t, n) {
      var o, r, i = B(e, function (e) {
        return e.name === t;
      }), a = !!i && e.some(function (e) {
        return e.name === n && e.enabled && e.order < i.order;
      });
      return a || (o = "`" + t + "`", r = "`" + n + "`", console.warn(r + " modifier is required by " + o + " modifier in order to work, be sure to include it before " + o + "!")), a;
    }
    var z = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"], G = z.slice(3);
    function _(e, t) {
      var n = 1 < arguments.length && void 0 !== t && t, o = G.indexOf(e), r = G.slice(o + 1).concat(G.slice(0, o));
      return n ? r.reverse() : r;
    }
    var X = "flip", J = "clockwise", K = "counterclockwise";
    function Q(e, r, i, t) {
      var a = [0, 0], s = -1 !== ["right", "left"].indexOf(t), n = e.split(/(\+|\-)/).map(function (e) {
        return e.trim();
      }), o = n.indexOf(B(n, function (e) {
        return -1 !== e.search(/,|\s/);
      }));
      n[o] && -1 === n[o].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
      var f = /\s*,\s*|\s+/;
      return (-1 !== o ? [n.slice(0, o).concat([n[o].split(f)[0]]), [n[o].split(f)[1]].concat(n.slice(o + 1))] : [n]).map(function (e, t) {
        var n = (1 === t ? !s : s) ? "height" : "width", o = false;
        return e.reduce(function (e, t) {
          return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t) ? (e[e.length - 1] = t, o = true, e) : o ? (e[e.length - 1] += t, o = false, e) : e.concat(t);
        }, []).map(function (e) {
          return function (e, t, n, o) {
            var r = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/), i = +r[1], a = r[2];
            if (!i) return e;
            if (0 !== a.indexOf("%")) return "vh" !== a && "vw" !== a ? i : ("vh" === a ? Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * i;
            var s = void 0;
            switch (a) {
              case "%p":
                s = n;
                break;
              case "%":
              case "%r":
              default:
                s = o;
            }
            return L({}, s, {right: s.left + s.width, bottom: s.top + s.height})[t] / 100 * i;
          }(e, n, r, i);
        });
      }).forEach(function (n, o) {
        n.forEach(function (e, t) {
          "" !== e && !isNaN(parseFloat(e)) && isFinite(e) && (a[o] += e * ("-" === n[t - 1] ? -1 : 1));
        });
      }), a;
    }
    var Z = {placement: "bottom", positionFixed: false, eventsEnabled: true, removeOnDestroy: false, onCreate: function () {}, onUpdate: function () {}, modifiers: {shift: {order: 100, enabled: true, fn: function (e) {
      var t, n, o, r, i, a, s, f = e.placement, p = f.split("-")[0], l = f.split("-")[1];
      return l && (n = (t = e.offsets).reference, o = t.popper, a = (r = -1 !== ["bottom", "top"].indexOf(p)) ? "width" : "height", s = {start: ((i = r ? "left" : "top") in {} ? Object.defineProperty({}, i = r ? "left" : "top", {value: n[i], enumerable: true, configurable: true, writable: true}) : {}[i = r ? "left" : "top"] = n[i], {}), end: (i in {} ? Object.defineProperty({}, i, {value: n[i] + n[a] - o[a], enumerable: true, configurable: true, writable: true}) : {}[i] = n[i] + n[a] - o[a], {})}, e.offsets.popper = L({}, o, s[l])), e;
    }}, offset: {order: 200, enabled: true, fn: function (e, t) {
      var n = t.offset, o = e.placement, r = e.offsets, i = r.popper, a = r.reference, s = o.split("-")[0], f = void 0, f = "" !== +n && !isNaN(parseFloat(+n)) && isFinite(+n) ? [+n, 0] : Q(n, i, a, s);
      return "left" === s ? (i.top += f[0], i.left -= f[1]) : "right" === s ? (i.top += f[0], i.left += f[1]) : "top" === s ? (i.left += f[0], i.top -= f[1]) : "bottom" === s && (i.left += f[0], i.top += f[1]), e.popper = i, e;
    }, offset: 0}, preventOverflow: {order: 300, enabled: true, fn: function (e, o) {
      var t = o.boundariesElement || w(e.instance.popper);
      e.instance.reference === t && (t = w(t));
      var n = S("transform"), r = e.instance.popper.style, i = r.top, a = r.left, s = r[n];
      r.top = "", r.left = "", r[n] = "";
      var f = c(e.instance.popper, e.instance.reference, o.padding, t, e.positionFixed);
      r.top = i, r.left = a, r[n] = s, o.boundaries = f;
      var p = o.priority, l = e.offsets.popper, d = {primary: function (e) {
        var t = l[e];
        return l[e] < f[e] && !o.escapeWithReference && (t = Math.max(l[e], f[e])), (e in {} ? Object.defineProperty({}, e, {value: t, enumerable: true, configurable: true, writable: true}) : {}[e] = t, {});
      }, secondary: function (e) {
        var t = "right" === e ? "left" : "top", n = l[t];
        return l[e] > f[e] && !o.escapeWithReference && (n = Math.min(l[t], f[e] - ("right" === e ? l.width : l.height))), (t in {} ? Object.defineProperty({}, t, {value: n, enumerable: true, configurable: true, writable: true}) : {}[t] = n, {});
      }};
      return p.forEach(function (e) {
        var t = -1 !== ["left", "top"].indexOf(e) ? "primary" : "secondary";
        l = L({}, l, d[t](e));
      }), e.offsets.popper = l, e;
    }, priority: ["left", "right", "top", "bottom"], padding: 5, boundariesElement: "scrollParent"}, keepTogether: {order: 400, enabled: true, fn: function (e) {
      var t = e.offsets, n = t.popper, o = t.reference, r = e.placement.split("-")[0], i = Math.floor, a = -1 !== ["top", "bottom"].indexOf(r), s = a ? "right" : "bottom", f = a ? "left" : "top", p = a ? "width" : "height";
      return n[s] < i(o[f]) && (e.offsets.popper[f] = i(o[f]) - n[p]), n[f] > i(o[s]) && (e.offsets.popper[f] = i(o[s])), e;
    }}, arrow: {order: 500, enabled: true, fn: function (e, t) {
      var n;
      if (!q(e.instance.modifiers, "arrow", "keepTogether")) return e;
      var o = t.element;
      if ("string" == typeof o) {
        if (!(o = e.instance.popper.querySelector(o))) return e;
      } else if (!e.instance.popper.contains(o)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), e;
      var r = e.placement.split("-")[0], i = e.offsets, a = i.popper, s = i.reference, f = -1 !== ["left", "right"].indexOf(r), p = f ? "height" : "width", l = f ? "Top" : "Left", d = l.toLowerCase(), u = f ? "left" : "top", c = f ? "bottom" : "right", h = k(o)[p];
      s[c] - h < a[d] && (e.offsets.popper[d] -= a[d] - (s[c] - h)), s[d] + h > a[c] && (e.offsets.popper[d] += s[d] + h - a[c]), e.offsets.popper = L({}, e.offsets.popper, {right: e.offsets.popper.left + e.offsets.popper.width, bottom: e.offsets.popper.top + e.offsets.popper.height});
      var m = s[d] + s[p] / 2 - h / 2, g = y(e.instance.popper), v = parseFloat(g["margin" + l]), b = parseFloat(g["border" + l + "Width"]), w = m - e.offsets.popper[d] - v - b, w = Math.max(Math.min(a[p] - h, w), 0);
      return e.arrowElement = o, e.offsets.arrow = (d in (n = {}) ? Object.defineProperty(n = {}, d, {value: Math.round(w), enumerable: true, configurable: true, writable: true}) : (n = {})[d] = Math.round(w), n = {}, (u in n ? Object.defineProperty(n, u, {value: "", enumerable: true, configurable: true, writable: true}) : n[u] = "", n), n), e;
    }, element: "[x-arrow]"}, flip: {order: 600, enabled: true, fn: function (g, v) {
      if (P(g.instance.modifiers, "inner")) return g;
      if (g.flipped && g.placement === g.originalPlacement) return g;
      var b = c(g.instance.popper, g.instance.reference, v.padding, v.boundariesElement, g.positionFixed), w = g.placement.split("-")[0], y = H(w), x = g.placement.split("-")[1] || "", E = [];
      switch (v.behavior) {
        case X:
          E = [w, y];
          break;
        case J:
          E = _(w);
          break;
        case K:
          E = _(w, true);
          break;
        default:
          E = v.behavior;
      }
      return E.forEach(function (e, t) {
        if (w !== e || E.length === t + 1) return g;
        w = g.placement.split("-")[0], y = H(w);
        var n, o = g.offsets.popper, r = g.offsets.reference, i = Math.floor, a = "left" === w && i(o.right) > i(r.left) || "right" === w && i(o.left) < i(r.right) || "top" === w && i(o.bottom) > i(r.top) || "bottom" === w && i(o.top) < i(r.bottom), s = i(o.left) < i(b.left), f = i(o.right) > i(b.right), p = i(o.top) < i(b.top), l = i(o.bottom) > i(b.bottom), d = "left" === w && s || "right" === w && f || "top" === w && p || "bottom" === w && l, u = -1 !== ["top", "bottom"].indexOf(w), c = !!v.flipVariations && (u && "start" === x && s || u && "end" === x && f || !u && "start" === x && p || !u && "end" === x && l), h = !!v.flipVariationsByContent && (u && "start" === x && f || u && "end" === x && s || !u && "start" === x && l || !u && "end" === x && p), m = c || h;
        (a || d || m) && (g.flipped = true, (a || d) && (w = E[t + 1]), m && (x = "end" === (n = x) ? "start" : "start" === n ? "end" : n), g.placement = w + (x ? "-" + x : ""), g.offsets.popper = L({}, g.offsets.popper, C(g.instance.popper, g.offsets.reference, g.placement)), g = A(g.instance.modifiers, g, "flip"));
      }), g;
    }, behavior: "flip", padding: 5, boundariesElement: "viewport", flipVariations: false, flipVariationsByContent: false}, inner: {order: 700, enabled: false, fn: function (e) {
      var t = e.placement, n = t.split("-")[0], o = e.offsets, r = o.popper, i = o.reference, a = -1 !== ["left", "right"].indexOf(n), s = -1 === ["top", "left"].indexOf(n);
      return r[a ? "left" : "top"] = i[n] - (s ? r[a ? "width" : "height"] : 0), e.placement = H(t), e.offsets.popper = L({}, r, {right: r.left + r.width, bottom: r.top + r.height}), e;
    }}, hide: {order: 800, enabled: true, fn: function (e) {
      if (!q(e.instance.modifiers, "hide", "preventOverflow")) return e;
      var t = e.offsets.reference, n = B(e.instance.modifiers, function (e) {
        return "preventOverflow" === e.name;
      }).boundaries;
      if (t.bottom < n.top || t.left > n.right || t.top > n.bottom || t.right < n.left) {
        if (true === e.hide) return e;
        e.hide = true, e.attributes["x-out-of-boundaries"] = "";
      } else {
        if (false === e.hide) return e;
        e.hide = false, e.attributes["x-out-of-boundaries"] = false;
      }
      return e;
    }}, computeStyle: {order: 850, enabled: true, fn: function (e, t) {
      var n = t.x, o = t.y, r = e.offsets.popper, i = B(e.instance.modifiers, function (e) {
        return "applyStyle" === e.name;
      }).gpuAcceleration;
      void 0 !== i && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
      var a, s, f = void 0 !== i ? i : t.gpuAcceleration, p = w(e.instance.popper), l = D(p), d = {position: r.position}, u = Y(e, window.devicePixelRatio < 2 || !V), c = "bottom" === n ? "top" : "bottom", h = "right" === o ? "left" : "right", m = S("transform"), g = void 0, v = void 0, v = "bottom" == c ? "HTML" === p.nodeName ? -p.clientHeight + u.bottom : -l.height + u.bottom : u.top, g = "right" == h ? "HTML" === p.nodeName ? -p.clientWidth + u.right : -l.width + u.right : u.left;
      f && m ? (d[m] = "translate3d(" + g + "px, " + v + "px, 0)", d[c] = 0, d[h] = 0, d.willChange = "transform") : (a = "bottom" == c ? -1 : 1, s = "right" == h ? -1 : 1, d[c] = v * a, d[h] = g * s, d.willChange = c + ", " + h);
      var b = {"x-placement": e.placement};
      return e.attributes = L({}, b, e.attributes), e.styles = L({}, d, e.styles), e.arrowStyles = L({}, e.offsets.arrow, e.arrowStyles), e;
    }, gpuAcceleration: true, x: "bottom", y: "right"}, applyStyle: {order: 900, enabled: true, fn: function (e) {
      var t, n;
      return U(e.instance.popper, e.styles), t = e.instance.popper, n = e.attributes, Object.keys(n).forEach(function (e) {
        false !== n[e] ? t.setAttribute(e, n[e]) : t.removeAttribute(e);
      }), e.arrowElement && Object.keys(e.arrowStyles).length && U(e.arrowElement, e.arrowStyles), e;
    }, onLoad: function (e, t, n, o, r) {
      var i = F(r, t, e, n.positionFixed), a = u(n.placement, i, t, e, n.modifiers.flip.boundariesElement, n.modifiers.flip.padding);
      return t.setAttribute("x-placement", a), U(t, {position: n.positionFixed ? "fixed" : "absolute"}), n;
    }, gpuAcceleration: void 0}}}, $ = ([{key: "update", value: function () {
      return function () {
        var e;
        this.state.isDestroyed || ((e = {instance: this, styles: {}, arrowStyles: {}, attributes: {}, flipped: false, offsets: {}}).offsets.reference = F(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = u(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = C(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e = A(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = true, this.options.onCreate(e)));
      }.call(this);
    }}, {key: "destroy", value: function () {
      return function () {
        return this.state.isDestroyed = true, P(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[S("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this;
      }.call(this);
    }}, {key: "enableEventListeners", value: function () {
      return function () {
        this.state.eventsEnabled || (this.state = j(this.reference, this.options, this.state, this.scheduleUpdate));
      }.call(this);
    }}, {key: "disableEventListeners", value: function () {
      return I.call(this);
    }}] && p(ee.prototype, [{key: "update", value: function () {
      return function () {
        var e;
        this.state.isDestroyed || ((e = {instance: this, styles: {}, arrowStyles: {}, attributes: {}, flipped: false, offsets: {}}).offsets.reference = F(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = u(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = C(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e = A(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = true, this.options.onCreate(e)));
      }.call(this);
    }}, {key: "destroy", value: function () {
      return function () {
        return this.state.isDestroyed = true, P(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[S("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this;
      }.call(this);
    }}, {key: "enableEventListeners", value: function () {
      return function () {
        this.state.eventsEnabled || (this.state = j(this.reference, this.options, this.state, this.scheduleUpdate));
      }.call(this);
    }}, {key: "disableEventListeners", value: function () {
      return I.call(this);
    }}]), n && p(ee, n), ee, ee);
    function ee(e, t) {
      var n = this, o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
      f(this, ee), this.scheduleUpdate = function () {
        return requestAnimationFrame(n.update);
      }, this.update = i(this.update.bind(this)), this.options = L({}, ee.Defaults, o), this.state = {isDestroyed: false, isCreated: false, scrollParents: []}, this.reference = e && e.jquery ? e[0] : e, this.popper = t && t.jquery ? t[0] : t, this.options.modifiers = {}, Object.keys(L({}, ee.Defaults.modifiers, o.modifiers)).forEach(function (e) {
        n.options.modifiers[e] = L({}, ee.Defaults.modifiers[e] || {}, o.modifiers ? o.modifiers[e] : {});
      }), this.modifiers = Object.keys(this.options.modifiers).map(function (e) {
        return L({name: e}, n.options.modifiers[e]);
      }).sort(function (e, t) {
        return e.order - t.order;
      }), this.modifiers.forEach(function (e) {
        e.enabled && (e.onLoad && "[object Function]" === {}.toString.call(e.onLoad)) && e.onLoad(n.reference, n.popper, n.options, e, n.state);
      }), this.update();
      var r = this.options.eventsEnabled;
      r && this.enableEventListeners(), this.state.eventsEnabled = r;
    }
    return $.Utils = ("undefined" != typeof window ? window : global).PopperUtils, $.placements = z, $.Defaults = Z, $;
  });
  !function (h, i, n, a) {
    function l(t, e) {
      this.settings = null, this.options = h.extend({}, l.Defaults, e), this.$element = h(t), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {time: null, target: null, pointer: null, stage: {start: null, current: null}, direction: null}, this._states = {current: {}, tags: {initializing: ["busy"], animating: ["busy"], dragging: ["interacting"]}}, h.each(["onResize", "onThrottledResize"], h.proxy(function (t, e) {
        this._handlers[e] = h.proxy(this[e], this);
      }, this)), h.each(l.Plugins, h.proxy(function (t, e) {
        this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this);
      }, this)), h.each(l.Workers, h.proxy(function (t, e) {
        this._pipe.push({filter: e.filter, run: h.proxy(e.run, this)});
      }, this)), this.setup(), this.initialize();
    }
    l.Defaults = {items: 3, loop: false, center: false, rewind: false, checkVisibility: true, mouseDrag: true, touchDrag: true, pullDrag: true, freeDrag: false, margin: 0, stagePadding: 0, merge: false, mergeFit: true, autoWidth: false, startPosition: 0, rtl: false, smartSpeed: 250, fluidSpeed: false, dragEndSpeed: false, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: i, fallbackEasing: "swing", slideTransition: "", info: false, nestedItemSelector: false, itemElement: "div", stageElement: "div", refreshClass: "owl-refresh", loadedClass: "owl-loaded", loadingClass: "owl-loading", rtlClass: "owl-rtl", responsiveClass: "owl-responsive", dragClass: "owl-drag", itemClass: "owl-item", stageClass: "owl-stage", stageOuterClass: "owl-stage-outer", grabClass: "owl-grab"}, l.Width = {Default: "default", Inner: "inner", Outer: "outer"}, l.Type = {Event: "event", State: "state"}, l.Plugins = {}, l.Workers = [{filter: ["width", "settings"], run: function () {
      this._width = this.$element.width();
    }}, {filter: ["width", "items", "settings"], run: function (t) {
      t.current = this._items && this._items[this.relative(this._current)];
    }}, {filter: ["items", "settings"], run: function () {
      this.$stage.children(".cloned").remove();
    }}, {filter: ["width", "items", "settings"], run: function (t) {
      var e = this.settings.margin || "", i = !this.settings.autoWidth, s = this.settings.rtl, n = {width: "auto", "margin-left": s ? e : "", "margin-right": s ? "" : e};
      i || this.$stage.children().css(n), t.css = n;
    }}, {filter: ["width", "items", "settings"], run: function (t) {
      var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin, i = null, s = this._items.length, n = !this.settings.autoWidth, o = [];
      for (t.items = {merge: false, width: e}; s--;) i = this._mergers[s], i = this.settings.mergeFit && Math.min(i, this.settings.items) || i, t.items.merge = 1 < i || t.items.merge, o[s] = n ? e * i : this._items[s].width();
      this._widths = o;
    }}, {filter: ["items", "settings"], run: function () {
      var t = [], e = this._items, i = this.settings, s = Math.max(2 * i.items, 4), n = 2 * Math.ceil(e.length / 2), o = i.loop && e.length ? i.rewind ? s : Math.max(s, n) : 0, r = "", a = "";
      for (o /= 2; 0 < o;) t.push(this.normalize(t.length / 2, true)), r += e[t[t.length - 1]][0].outerHTML, t.push(this.normalize(e.length - 1 - (t.length - 1) / 2, true)), a = e[t[t.length - 1]][0].outerHTML + a, --o;
      this._clones = t, h(r).addClass("cloned").appendTo(this.$stage), h(a).addClass("cloned").prependTo(this.$stage);
    }}, {filter: ["width", "items", "settings"], run: function () {
      for (var t, e, i = this.settings.rtl ? 1 : -1, s = this._clones.length + this._items.length, n = -1, o = []; ++n < s;) t = o[n - 1] || 0, e = this._widths[this.relative(n)] + this.settings.margin, o.push(t + e * i);
      this._coordinates = o;
    }}, {filter: ["width", "items", "settings"], run: function () {
      var t = this.settings.stagePadding, e = this._coordinates, i = {width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t, "padding-left": t || "", "padding-right": t || ""};
      this.$stage.css(i);
    }}, {filter: ["width", "items", "settings"], run: function (t) {
      var e = this._coordinates.length, i = !this.settings.autoWidth, s = this.$stage.children();
      if (i && t.items.merge) for (; e--;) t.css.width = this._widths[this.relative(e)], s.eq(e).css(t.css); else i && (t.css.width = t.items.width, s.css(t.css));
    }}, {filter: ["items"], run: function () {
      this._coordinates.length < 1 && this.$stage.removeAttr("style");
    }}, {filter: ["width", "items", "settings"], run: function (t) {
      t.current = t.current ? this.$stage.children().index(t.current) : 0, t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current)), this.reset(t.current);
    }}, {filter: ["position"], run: function () {
      this.animate(this.coordinates(this._current));
    }}, {filter: ["width", "position", "items", "settings"], run: function () {
      for (var t, e, i = this.settings.rtl ? 1 : -1, s = 2 * this.settings.stagePadding, n = this.coordinates(this.current()) + s, o = n + this.width() * i, r = [], a = 0, h = this._coordinates.length; a < h; a++) t = this._coordinates[a - 1] || 0, e = Math.abs(this._coordinates[a]) + s * i, (this.op(t, "<=", n) && this.op(t, ">", o) || this.op(e, "<", n) && this.op(e, ">", o)) && r.push(a);
      this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + r.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center");
    }}], l.prototype.initializeStage = function () {
      this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = h("<" + this.settings.stageElement + ">", {class: this.settings.stageClass}).wrap(h("<div/>", {class: this.settings.stageOuterClass})), this.$element.append(this.$stage.parent()));
    }, l.prototype.initializeItems = function () {
      var t = this.$element.find(".owl-item");
      if (t.length) return this._items = t.get().map(function (t) {
        return h(t);
      }), this._mergers = this._items.map(function () {
        return 1;
      }), void this.refresh();
      this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);
    }, l.prototype.initialize = function () {
      var t, e, i;
      this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading") && (t = this.$element.find("img"), e = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : a, i = this.$element.children(e).width(), t.length && i <= 0 && this.preloadAutoWidthImages(t)), this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized");
    }, l.prototype.isVisible = function () {
      return !this.settings.checkVisibility || this.$element.is(":visible");
    }, l.prototype.setup = function () {
      var e = this.viewport(), t = this.options.responsive, i = -1, s = null;
      t ? (h.each(t, function (t) {
        t <= e && i < t && (i = Number(t));
      }), "function" == typeof (s = h.extend({}, this.options, t[i])).stagePadding && (s.stagePadding = s.stagePadding()), delete s.responsive, s.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + i))) : s = h.extend({}, this.options), this.trigger("change", {property: {name: "settings", value: s}}), this._breakpoint = i, this.settings = s, this.invalidate("settings"), this.trigger("changed", {property: {name: "settings", value: this.settings}});
    }, l.prototype.optionsLogic = function () {
      this.settings.autoWidth && (this.settings.stagePadding = false, this.settings.merge = false);
    }, l.prototype.prepare = function (t) {
      var e = this.trigger("prepare", {content: t});
      return e.data || (e.data = h("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(t)), this.trigger("prepared", {content: e.data}), e.data;
    }, l.prototype.update = function () {
      for (var t = 0, e = this._pipe.length, i = h.proxy(function (t) {
        return this[t];
      }, this._invalidated), s = {}; t < e;) (this._invalidated.all || 0 < h.grep(this._pipe[t].filter, i).length) && this._pipe[t].run(s), t++;
      this._invalidated = {}, this.is("valid") || this.enter("valid");
    }, l.prototype.width = function (t) {
      switch (t = t || l.Width.Default) {
        case l.Width.Inner:
        case l.Width.Outer:
          return this._width;
        default:
          return this._width - 2 * this.settings.stagePadding + this.settings.margin;
      }
    }, l.prototype.refresh = function () {
      this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed");
    }, l.prototype.onThrottledResize = function () {
      i.clearTimeout(this.resizeTimer), this.resizeTimer = i.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
    }, l.prototype.onResize = function () {
      return !!this._items.length && (this._width !== this.$element.width() && (!!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), false) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))));
    }, l.prototype.registerEventHandlers = function () {
      h.support.transition && this.$stage.on(h.support.transition.end + ".owl.core", h.proxy(this.onTransitionEnd, this)), false !== this.settings.responsive && this.on(i, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", h.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
        return false;
      })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", h.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", h.proxy(this.onDragEnd, this)));
    }, l.prototype.onDragStart = function (t) {
      var e = null;
      3 !== t.which && (e = h.support.transform ? {x: (e = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","))[16 === e.length ? 12 : 4], y: e[16 === e.length ? 13 : 5]} : (e = this.$stage.position(), {x: this.settings.rtl ? e.left + this.$stage.width() - this.width() + this.settings.margin : e.left, y: e.top}), this.is("animating") && (h.support.transform ? this.animate(e.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === t.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = h(t.target), this._drag.stage.start = e, this._drag.stage.current = e, this._drag.pointer = this.pointer(t), h(n).on("mouseup.owl.core touchend.owl.core", h.proxy(this.onDragEnd, this)), h(n).one("mousemove.owl.core touchmove.owl.core", h.proxy(function (t) {
        var e = this.difference(this._drag.pointer, this.pointer(t));
        h(n).on("mousemove.owl.core touchmove.owl.core", h.proxy(this.onDragMove, this)), Math.abs(e.x) < Math.abs(e.y) && this.is("valid") || (t.preventDefault(), this.enter("dragging"), this.trigger("drag"));
      }, this)));
    }, l.prototype.onDragMove = function (t) {
      var e, i = null, s = null, n = this.difference(this._drag.pointer, this.pointer(t)), o = this.difference(this._drag.stage.start, n);
      this.is("dragging") && (t.preventDefault(), this.settings.loop ? (i = this.coordinates(this.minimum()), s = this.coordinates(this.maximum() + 1) - i, o.x = ((o.x - i) % s + s) % s + i) : (i = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), s = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), e = this.settings.pullDrag ? -1 * n.x / 5 : 0, o.x = Math.max(Math.min(o.x, i + e), s + e)), this._drag.stage.current = o, this.animate(o.x));
    }, l.prototype.onDragEnd = function (t) {
      var e = this.difference(this._drag.pointer, this.pointer(t)), i = this._drag.stage.current, s = 0 < e.x ^ this.settings.rtl ? "left" : "right";
      h(n).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== e.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(i.x, 0 !== e.x ? s : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = s, (3 < Math.abs(e.x) || 300 < (new Date).getTime() - this._drag.time) && this._drag.target.one("click.owl.core", function () {
        return false;
      })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"));
    }, l.prototype.closest = function (i, s) {
      var n = -1, o = this.width(), r = this.coordinates();
      return this.settings.freeDrag || h.each(r, h.proxy(function (t, e) {
        return "left" === s && e - 30 < i && i < e + 30 ? n = t : "right" === s && e - o - 30 < i && i < e - o + 30 ? n = t + 1 : this.op(i, "<", e) && this.op(i, ">", r[t + 1] !== a ? r[t + 1] : e - o) && (n = "left" === s ? t + 1 : t), -1 === n;
      }, this)), this.settings.loop || (this.op(i, ">", r[this.minimum()]) ? n = i = this.minimum() : this.op(i, "<", r[this.maximum()]) && (n = i = this.maximum())), n;
    }, l.prototype.animate = function (t) {
      var e = 0 < this.speed();
      this.is("animating") && this.onTransitionEnd(), e && (this.enter("animating"), this.trigger("translate")), h.support.transform3d && h.support.transition ? this.$stage.css({transform: "translate3d(" + t + "px,0px,0px)", transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")}) : e ? this.$stage.animate({left: t + "px"}, this.speed(), this.settings.fallbackEasing, h.proxy(this.onTransitionEnd, this)) : this.$stage.css({left: t + "px"});
    }, l.prototype.is = function (t) {
      return this._states.current[t] && 0 < this._states.current[t];
    }, l.prototype.current = function (t) {
      return t === a ? this._current : 0 === this._items.length ? a : (t = this.normalize(t), this._current !== t && ((e = this.trigger("change", {property: {name: "position", value: t}})).data !== a && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {property: {name: "position", value: this._current}})), this._current);
      var e;
    }, l.prototype.invalidate = function (t) {
      return "string" === h.type(t) && (this._invalidated[t] = true, this.is("valid") && this.leave("valid")), h.map(this._invalidated, function (t, e) {
        return e;
      });
    }, l.prototype.reset = function (t) {
      (t = this.normalize(t)) !== a && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]));
    }, l.prototype.normalize = function (t, e) {
      var i = this._items.length, s = e ? 0 : this._clones.length;
      return !this.isNumeric(t) || i < 1 ? t = a : (t < 0 || i + s <= t) && (t = ((t - s / 2) % i + i) % i + s / 2), t;
    }, l.prototype.relative = function (t) {
      return t -= this._clones.length / 2, this.normalize(t, true);
    }, l.prototype.maximum = function (t) {
      var e, i, s, n = this.settings, o = this._coordinates.length;
      if (n.loop) o = this._clones.length / 2 + this._items.length - 1; else if (n.autoWidth || n.merge) {
        if (e = this._items.length) for (i = this._items[--e].width(), s = this.$element.width(); e-- && !(s < (i += this._items[e].width() + this.settings.margin));) ;
        o = e + 1;
      } else o = n.center ? this._items.length - 1 : this._items.length - n.items;
      return t && (o -= this._clones.length / 2), Math.max(o, 0);
    }, l.prototype.minimum = function (t) {
      return t ? 0 : this._clones.length / 2;
    }, l.prototype.items = function (t) {
      return t === a ? this._items.slice() : (t = this.normalize(t, true), this._items[t]);
    }, l.prototype.mergers = function (t) {
      return t === a ? this._mergers.slice() : (t = this.normalize(t, true), this._mergers[t]);
    }, l.prototype.clones = function (i) {
      function s(t) {
        return t % 2 == 0 ? n + t / 2 : e - (t + 1) / 2;
      }
      var e = this._clones.length / 2, n = e + this._items.length;
      return i === a ? h.map(this._clones, function (t, e) {
        return s(e);
      }) : h.map(this._clones, function (t, e) {
        return t === i ? s(e) : null;
      });
    }, l.prototype.speed = function (t) {
      return t !== a && (this._speed = t), this._speed;
    }, l.prototype.coordinates = function (t) {
      var e, i = 1, s = t - 1;
      return t === a ? h.map(this._coordinates, h.proxy(function (t, e) {
        return this.coordinates(e);
      }, this)) : (this.settings.center ? (this.settings.rtl && (i = -1, s = t + 1), e = this._coordinates[t], e += (this.width() - e + (this._coordinates[s] || 0)) / 2 * i) : e = this._coordinates[s] || 0, e = Math.ceil(e));
    }, l.prototype.duration = function (t, e, i) {
      return 0 === i ? 0 : Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed);
    }, l.prototype.to = function (t, e) {
      var i, s = this.current(), n = t - this.relative(s), o = (0 < n) - (n < 0), r = this._items.length, a = this.minimum(), h = this.maximum();
      this.settings.loop ? (!this.settings.rewind && Math.abs(n) > r / 2 && (n += -1 * o * r), (i = (((t = s + n) - a) % r + r) % r + a) !== t && i - n <= h && 0 < i - n && (s = i - n, t = i, this.reset(s))) : t = this.settings.rewind ? (t % (h += 1) + h) % h : Math.max(a, Math.min(h, t)), this.speed(this.duration(s, t, e)), this.current(t), this.isVisible() && this.update();
    }, l.prototype.next = function (t) {
      t = t || false, this.to(this.relative(this.current()) + 1, t);
    }, l.prototype.prev = function (t) {
      t = t || false, this.to(this.relative(this.current()) - 1, t);
    }, l.prototype.onTransitionEnd = function (t) {
      if (t !== a && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))) return false;
      this.leave("animating"), this.trigger("translated");
    }, l.prototype.viewport = function () {
      var t;
      return this.options.responsiveBaseElement !== i ? t = h(this.options.responsiveBaseElement).width() : i.innerWidth ? t = i.innerWidth : n.documentElement && n.documentElement.clientWidth ? t = n.documentElement.clientWidth : console.warn("Can not detect viewport width."), t;
    }, l.prototype.replace = function (t) {
      this.$stage.empty(), this._items = [], t = t && (t instanceof jQuery ? t : h(t)), this.settings.nestedItemSelector && (t = t.find("." + this.settings.nestedItemSelector)), t.filter(function () {
        return 1 === this.nodeType;
      }).each(h.proxy(function (t, e) {
        e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(+e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1);
      }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items");
    }, l.prototype.add = function (t, e) {
      var i = this.relative(this._current);
      e = e === a ? this._items.length : this.normalize(e, true), t = t instanceof jQuery ? t : h(t), this.trigger("add", {content: t, position: e}), t = this.prepare(t), 0 === this._items.length || e === this._items.length ? (0 === this._items.length && this.$stage.append(t), 0 !== this._items.length && this._items[e - 1].after(t), this._items.push(t), this._mergers.push(+t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[e].before(t), this._items.splice(e, 0, t), this._mergers.splice(e, 0, +t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[i] && this.reset(this._items[i].index()), this.invalidate("items"), this.trigger("added", {content: t, position: e});
    }, l.prototype.remove = function (t) {
      (t = this.normalize(t, true)) !== a && (this.trigger("remove", {content: this._items[t], position: t}), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {content: null, position: t}));
    }, l.prototype.preloadAutoWidthImages = function (t) {
      t.each(h.proxy(function (t, e) {
        this.enter("pre-loading"), e = h(e), h(new Image).one("load", h.proxy(function (t) {
          e.attr("src", t.target.src), e.css("opacity", 1), this.leave("pre-loading"), this.is("pre-loading") || this.is("initializing") || this.refresh();
        }, this)).attr("src", e.attr("src") || e.attr("data-src") || e.attr("data-src-retina"));
      }, this));
    }, l.prototype.destroy = function () {
      for (var t in this.$element.off(".owl.core"), this.$stage.off(".owl.core"), h(n).off(".owl.core"), false !== this.settings.responsive && (i.clearTimeout(this.resizeTimer), this.off(i, "resize", this._handlers.onThrottledResize)), this._plugins) this._plugins[t].destroy();
      this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel");
    }, l.prototype.op = function (t, e, i) {
      var s = this.settings.rtl;
      switch (e) {
        case "<":
          return s ? i < t : t < i;
        case ">":
          return s ? t < i : i < t;
        case ">=":
          return s ? t <= i : i <= t;
        case "<=":
          return s ? i <= t : t <= i;
      }
    }, l.prototype.on = function (t, e, i, s) {
      t.addEventListener ? t.addEventListener(e, i, s) : t.attachEvent && t.attachEvent("on" + e, i);
    }, l.prototype.off = function (t, e, i, s) {
      t.removeEventListener ? t.removeEventListener(e, i, s) : t.detachEvent && t.detachEvent("on" + e, i);
    }, l.prototype.trigger = function (t, e, i, s, n) {
      var o = {item: {count: this._items.length, index: this.current()}}, r = h.camelCase(h.grep(["on", t, i], function (t) {
        return t;
      }).join("-").toLowerCase()), a = h.Event([t, "owl", i || "carousel"].join(".").toLowerCase(), h.extend({relatedTarget: this}, o, e));
      return this._supress[t] || (h.each(this._plugins, function (t, e) {
        e.onTrigger && e.onTrigger(a);
      }), this.register({type: l.Type.Event, name: t}), this.$element.trigger(a), this.settings && "function" == typeof this.settings[r] && this.settings[r].call(this, a)), a;
    }, l.prototype.enter = function (t) {
      h.each([t].concat(this._states.tags[t] || []), h.proxy(function (t, e) {
        this._states.current[e] === a && (this._states.current[e] = 0), this._states.current[e]++;
      }, this));
    }, l.prototype.leave = function (t) {
      h.each([t].concat(this._states.tags[t] || []), h.proxy(function (t, e) {
        this._states.current[e]--;
      }, this));
    }, l.prototype.register = function (i) {
      var e;
      i.type === l.Type.Event ? (h.event.special[i.name] || (h.event.special[i.name] = {}), h.event.special[i.name].owl || (e = h.event.special[i.name]._default, h.event.special[i.name]._default = function (t) {
        return !e || !e.apply || t.namespace && -1 !== t.namespace.indexOf("owl") ? t.namespace && -1 < t.namespace.indexOf("owl") : e.apply(this, arguments);
      }, h.event.special[i.name].owl = true)) : i.type === l.Type.State && (this._states.tags[i.name] ? this._states.tags[i.name] = this._states.tags[i.name].concat(i.tags) : this._states.tags[i.name] = i.tags, this._states.tags[i.name] = h.grep(this._states.tags[i.name], h.proxy(function (t, e) {
        return h.inArray(t, this._states.tags[i.name]) === e;
      }, this)));
    }, l.prototype.suppress = function (t) {
      h.each(t, h.proxy(function (t, e) {
        this._supress[e] = true;
      }, this));
    }, l.prototype.release = function (t) {
      h.each(t, h.proxy(function (t, e) {
        delete this._supress[e];
      }, this));
    }, l.prototype.pointer = function (t) {
      var e = {x: null, y: null};
      return (t = (t = t.originalEvent || t || i.event).touches && t.touches.length ? t.touches[0] : t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t).pageX ? (e.x = t.pageX, e.y = t.pageY) : (e.x = t.clientX, e.y = t.clientY), e;
    }, l.prototype.isNumeric = function (t) {
      return !isNaN(parseFloat(t));
    }, l.prototype.difference = function (t, e) {
      return {x: t.x - e.x, y: t.y - e.y};
    }, h.fn.owlCarousel = function (e) {
      var s = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var t = h(this), i = t.data("owl.carousel");
        i || (i = new l(this, "object" == typeof e && e), t.data("owl.carousel", i), h.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (t, e) {
          i.register({type: l.Type.Event, name: e}), i.$element.on(e + ".owl.carousel.core", h.proxy(function (t) {
            t.namespace && t.relatedTarget !== this && (this.suppress([e]), i[e].apply(this, [].slice.call(arguments, 1)), this.release([e]));
          }, i));
        })), "string" == typeof e && "_" !== e.charAt(0) && i[e].apply(i, s);
      });
    }, h.fn.owlCarousel.Constructor = l;
  }(window.Zepto || window.jQuery, window, document), function (e, i) {
    var s = function (t) {
      this._core = t, this._interval = null, this._visible = null, this._handlers = {"initialized.owl.carousel": e.proxy(function (t) {
        t.namespace && this._core.settings.autoRefresh && this.watch();
      }, this)}, this._core.options = e.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers);
    };
    s.Defaults = {autoRefresh: true, autoRefreshInterval: 500}, s.prototype.watch = function () {
      this._interval || (this._visible = this._core.isVisible(), this._interval = i.setInterval(e.proxy(this.refresh, this), this._core.settings.autoRefreshInterval));
    }, s.prototype.refresh = function () {
      this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh());
    }, s.prototype.destroy = function () {
      var t, e;
      for (t in i.clearInterval(this._interval), this._handlers) this._core.$element.off(t, this._handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null);
    }, e.fn.owlCarousel.Constructor.Plugins.AutoRefresh = s;
  }(window.Zepto || window.jQuery, window, document), function (a, o) {
    var e = function (t) {
      this._core = t, this._loaded = [], this._handlers = {"initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (t) {
        if (t.namespace && this._core.settings && this._core.settings.lazyLoad && (t.property && "position" == t.property.name || "initialized" == t.type)) {
          var e = this._core.settings, i = e.center && Math.ceil(e.items / 2) || e.items, s = e.center && -1 * i || 0, n = (t.property && void 0 !== t.property.value ? t.property.value : this._core.current()) + s, o = this._core.clones().length, r = a.proxy(function (t, e) {
            this.load(e);
          }, this);
          for (0 < e.lazyLoadEager && (i += e.lazyLoadEager, e.loop && (n -= e.lazyLoadEager, i++)); s++ < i;) this.load(o / 2 + this._core.relative(n)), o && a.each(this._core.clones(this._core.relative(n)), r), n++;
        }
      }, this)}, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers);
    };
    e.Defaults = {lazyLoad: false, lazyLoadEager: 0}, e.prototype.load = function (t) {
      var e = this._core.$stage.children().eq(t), i = e && e.find(".owl-lazy");
      !i || -1 < a.inArray(e.get(0), this._loaded) || (i.each(a.proxy(function (t, e) {
        var i, s = a(e), n = 1 < o.devicePixelRatio && s.attr("data-src-retina") || s.attr("data-src") || s.attr("data-srcset");
        this._core.trigger("load", {element: s, url: n}, "lazy"), s.is("img") ? s.one("load.owl.lazy", a.proxy(function () {
          s.css("opacity", 1), this._core.trigger("loaded", {element: s, url: n}, "lazy");
        }, this)).attr("src", n) : s.is("source") ? s.one("load.owl.lazy", a.proxy(function () {
          this._core.trigger("loaded", {element: s, url: n}, "lazy");
        }, this)).attr("srcset", n) : ((i = new Image).onload = a.proxy(function () {
          s.css({"background-image": 'url("' + n + '")', opacity: "1"}), this._core.trigger("loaded", {element: s, url: n}, "lazy");
        }, this), i.src = n);
      }, this)), this._loaded.push(e.get(0)));
    }, e.prototype.destroy = function () {
      var t, e;
      for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null);
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e;
  }(window.Zepto || window.jQuery, window, document), function (r, i) {
    var s = function (t) {
      this._core = t, this._previousHeight = null, this._handlers = {"initialized.owl.carousel refreshed.owl.carousel": r.proxy(function (t) {
        t.namespace && this._core.settings.autoHeight && this.update();
      }, this), "changed.owl.carousel": r.proxy(function (t) {
        t.namespace && this._core.settings.autoHeight && "position" === t.property.name && this.update();
      }, this), "loaded.owl.lazy": r.proxy(function (t) {
        t.namespace && this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update();
      }, this)}, this._core.options = r.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null;
      var e = this;
      r(i).on("load", function () {
        e._core.settings.autoHeight && e.update();
      }), r(i).resize(function () {
        e._core.settings.autoHeight && (null != e._intervalId && clearTimeout(e._intervalId), e._intervalId = setTimeout(function () {
          e.update();
        }, 250));
      });
    };
    s.Defaults = {autoHeight: false, autoHeightClass: "owl-height"}, s.prototype.update = function () {
      var t = this._core._current, e = t + this._core.settings.items, i = this._core.settings.lazyLoad, s = this._core.$stage.children().toArray().slice(t, e), n = [], o = 0;
      r.each(s, function (t, e) {
        n.push(r(e).height());
      }), (o = Math.max.apply(null, n)) <= 1 && i && this._previousHeight && (o = this._previousHeight), this._previousHeight = o, this._core.$stage.parent().height(o).addClass(this._core.settings.autoHeightClass);
    }, s.prototype.destroy = function () {
      var t, e;
      for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null);
    }, r.fn.owlCarousel.Constructor.Plugins.AutoHeight = s;
  }(window.Zepto || window.jQuery, window, document), function (c, e) {
    var i = function (t) {
      this._core = t, this._videos = {}, this._playing = null, this._handlers = {"initialized.owl.carousel": c.proxy(function (t) {
        t.namespace && this._core.register({type: "state", name: "playing", tags: ["interacting"]});
      }, this), "resize.owl.carousel": c.proxy(function (t) {
        t.namespace && this._core.settings.video && this.isInFullScreen() && t.preventDefault();
      }, this), "refreshed.owl.carousel": c.proxy(function (t) {
        t.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove();
      }, this), "changed.owl.carousel": c.proxy(function (t) {
        t.namespace && "position" === t.property.name && this._playing && this.stop();
      }, this), "prepared.owl.carousel": c.proxy(function (t) {
        var e;
        !t.namespace || (e = c(t.content).find(".owl-video")).length && (e.css("display", "none"), this.fetch(e, c(t.content)));
      }, this)}, this._core.options = c.extend({}, i.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", c.proxy(function (t) {
        this.play(t);
      }, this));
    };
    i.Defaults = {video: false, videoHeight: false, videoWidth: false}, i.prototype.fetch = function (t, e) {
      var i = t.attr("data-vimeo-id") ? "vimeo" : t.attr("data-vzaar-id") ? "vzaar" : "youtube", s = t.attr("data-vimeo-id") || t.attr("data-youtube-id") || t.attr("data-vzaar-id"), n = t.attr("data-width") || this._core.settings.videoWidth, o = t.attr("data-height") || this._core.settings.videoHeight, r = t.attr("href");
      if (!r) throw new Error("Missing video URL.");
      if (-1 < (s = r.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/))[3].indexOf("youtu")) i = "youtube"; else if (-1 < s[3].indexOf("vimeo")) i = "vimeo"; else {
        if (!(-1 < s[3].indexOf("vzaar"))) throw new Error("Video URL not supported.");
        i = "vzaar";
      }
      s = s[6], this._videos[r] = {type: i, id: s, width: n, height: o}, e.attr("data-video", r), this.thumbnail(t, this._videos[r]);
    }, i.prototype.thumbnail = function (e, t) {
      function i(t) {
        s = l.lazyLoad ? c("<div/>", {class: "owl-video-tn " + h, srcType: t}) : c("<div/>", {class: "owl-video-tn", style: "opacity:1;background-image:url(" + t + ")"}), e.after(s), e.after('<div class="owl-video-play-icon"></div>');
      }
      var s, n, o = t.width && t.height ? "width:" + t.width + "px;height:" + t.height + "px;" : "", r = e.find("img"), a = "src", h = "", l = this._core.settings;
      if (e.wrap(c("<div/>", {class: "owl-video-wrapper", style: o})), this._core.settings.lazyLoad && (a = "data-src", h = "owl-lazy"), r.length) return i(r.attr(a)), r.remove(), false;
      "youtube" === t.type ? (n = "//img.youtube.com/vi/" + t.id + "/hqdefault.jpg", i(n)) : "vimeo" === t.type ? c.ajax({type: "GET", url: "//vimeo.com/api/v2/video/" + t.id + ".json", jsonp: "callback", dataType: "jsonp", success: function (t) {
        n = t[0].thumbnail_large, i(n);
      }}) : "vzaar" === t.type && c.ajax({type: "GET", url: "//vzaar.com/api/videos/" + t.id + ".json", jsonp: "callback", dataType: "jsonp", success: function (t) {
        n = t.framegrab_url, i(n);
      }});
    }, i.prototype.stop = function () {
      this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video");
    }, i.prototype.play = function (t) {
      var e, i = c(t.target).closest("." + this._core.settings.itemClass), s = this._videos[i.attr("data-video")], n = s.width || "100%", o = s.height || this._core.$stage.height();
      this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), i = this._core.items(this._core.relative(i.index())), this._core.reset(i.index()), (e = c('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>')).attr("height", o), e.attr("width", n), "youtube" === s.type ? e.attr("src", "//www.youtube.com/embed/" + s.id + "?autoplay=1&rel=0&v=" + s.id) : "vimeo" === s.type ? e.attr("src", "//player.vimeo.com/video/" + s.id + "?autoplay=1") : "vzaar" === s.type && e.attr("src", "//view.vzaar.com/" + s.id + "/player?autoplay=true"), c(e).wrap('<div class="owl-video-frame" />').insertAfter(i.find(".owl-video")), this._playing = i.addClass("owl-video-playing"));
    }, i.prototype.isInFullScreen = function () {
      var t = e.fullscreenElement || e.mozFullScreenElement || e.webkitFullscreenElement;
      return t && c(t).parent().hasClass("owl-video-frame");
    }, i.prototype.destroy = function () {
      var t, e;
      for (t in this._core.$element.off("click.owl.video"), this._handlers) this._core.$element.off(t, this._handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null);
    }, c.fn.owlCarousel.Constructor.Plugins.Video = i;
  }(window.Zepto || window.jQuery, (window, document)), function (r) {
    var e = function (t) {
      this.core = t, this.core.options = r.extend({}, e.Defaults, this.core.options), this.swapping = true, this.previous = void 0, this.next = void 0, this.handlers = {"change.owl.carousel": r.proxy(function (t) {
        t.namespace && "position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value);
      }, this), "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": r.proxy(function (t) {
        t.namespace && (this.swapping = "translated" == t.type);
      }, this), "translate.owl.carousel": r.proxy(function (t) {
        t.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap();
      }, this)}, this.core.$element.on(this.handlers);
    };
    e.Defaults = {animateOut: false, animateIn: false}, e.prototype.swap = function () {
      var t, e, i, s, n, o;
      1 === this.core.settings.items && r.support.animation && r.support.transition && (this.core.speed(0), e = r.proxy(this.clear, this), i = this.core.$stage.children().eq(this.previous), s = this.core.$stage.children().eq(this.next), n = this.core.settings.animateIn, o = this.core.settings.animateOut, this.core.current() !== this.previous && (o && (t = this.core.coordinates(this.previous) - this.core.coordinates(this.next), i.one(r.support.animation.end, e).css({left: t + "px"}).addClass("animated owl-animated-out").addClass(o)), n && s.one(r.support.animation.end, e).addClass("animated owl-animated-in").addClass(n)));
    }, e.prototype.clear = function (t) {
      r(t.target).css({left: ""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd();
    }, e.prototype.destroy = function () {
      var t, e;
      for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null);
    }, r.fn.owlCarousel.Constructor.Plugins.Animate = e;
  }(window.Zepto || window.jQuery, (window, document)), function (s, n, e) {
    var i = function (t) {
      this._core = t, this._call = null, this._time = 0, this._timeout = 0, this._paused = true, this._handlers = {"changed.owl.carousel": s.proxy(function (t) {
        t.namespace && "settings" === t.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : t.namespace && "position" === t.property.name && this._paused && (this._time = 0);
      }, this), "initialized.owl.carousel": s.proxy(function (t) {
        t.namespace && this._core.settings.autoplay && this.play();
      }, this), "play.owl.autoplay": s.proxy(function (t, e, i) {
        t.namespace && this.play(e, i);
      }, this), "stop.owl.autoplay": s.proxy(function (t) {
        t.namespace && this.stop();
      }, this), "mouseover.owl.autoplay": s.proxy(function () {
        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
      }, this), "mouseleave.owl.autoplay": s.proxy(function () {
        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play();
      }, this), "touchstart.owl.core": s.proxy(function () {
        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
      }, this), "touchend.owl.core": s.proxy(function () {
        this._core.settings.autoplayHoverPause && this.play();
      }, this)}, this._core.$element.on(this._handlers), this._core.options = s.extend({}, i.Defaults, this._core.options);
    };
    i.Defaults = {autoplay: false, autoplayTimeout: 5e3, autoplayHoverPause: false, autoplaySpeed: false}, i.prototype._next = function (t) {
      this._call = n.setTimeout(s.proxy(this._next, this, t), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || e.hidden || this._core.next(t || this._core.settings.autoplaySpeed);
    }, i.prototype.read = function () {
      return (new Date).getTime() - this._time;
    }, i.prototype.play = function (t, e) {
      var i;
      this._core.is("rotating") || this._core.enter("rotating"), t = t || this._core.settings.autoplayTimeout, i = Math.min(this._time % (this._timeout || t), t), this._paused ? (this._time = this.read(), this._paused = false) : n.clearTimeout(this._call), this._time += this.read() % t - i, this._timeout = t, this._call = n.setTimeout(s.proxy(this._next, this, e), t - i);
    }, i.prototype.stop = function () {
      this._core.is("rotating") && (this._time = 0, this._paused = true, n.clearTimeout(this._call), this._core.leave("rotating"));
    }, i.prototype.pause = function () {
      this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = true, n.clearTimeout(this._call));
    }, i.prototype.destroy = function () {
      var t, e;
      for (t in this.stop(), this._handlers) this._core.$element.off(t, this._handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null);
    }, s.fn.owlCarousel.Constructor.Plugins.autoplay = i;
  }(window.Zepto || window.jQuery, window, document), function (o) {
    "use strict";
    var e = function (t) {
      this._core = t, this._initialized = false, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {next: this._core.next, prev: this._core.prev, to: this._core.to}, this._handlers = {"prepared.owl.carousel": o.proxy(function (t) {
        t.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + o(t.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>");
      }, this), "added.owl.carousel": o.proxy(function (t) {
        t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 0, this._templates.pop());
      }, this), "remove.owl.carousel": o.proxy(function (t) {
        t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 1);
      }, this), "changed.owl.carousel": o.proxy(function (t) {
        t.namespace && "position" == t.property.name && this.draw();
      }, this), "initialized.owl.carousel": o.proxy(function (t) {
        t.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = true, this._core.trigger("initialized", null, "navigation"));
      }, this), "refreshed.owl.carousel": o.proxy(function (t) {
        t.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"));
      }, this)}, this._core.options = o.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers);
    };
    e.Defaults = {nav: false, navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'], navSpeed: false, navElement: 'button type="button" role="presentation"', navContainer: false, navContainerClass: "owl-nav", navClass: ["owl-prev", "owl-next"], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: true, dotsEach: false, dotsData: false, dotsSpeed: false, dotsContainer: false}, e.prototype.initialize = function () {
      var t, i = this._core.settings;
      for (t in this._controls.$relative = (i.navContainer ? o(i.navContainer) : o("<div>").addClass(i.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = o("<" + i.navElement + ">").addClass(i.navClass[0]).html(i.navText[0]).prependTo(this._controls.$relative).on("click", o.proxy(function (t) {
        this.prev(i.navSpeed);
      }, this)), this._controls.$next = o("<" + i.navElement + ">").addClass(i.navClass[1]).html(i.navText[1]).appendTo(this._controls.$relative).on("click", o.proxy(function (t) {
        this.next(i.navSpeed);
      }, this)), i.dotsData || (this._templates = [o('<button role="button">').addClass(i.dotClass).append(o("<span>")).prop("outerHTML")]), this._controls.$absolute = (i.dotsContainer ? o(i.dotsContainer) : o("<div>").addClass(i.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", o.proxy(function (t) {
        var e = o(t.target).parent().is(this._controls.$absolute) ? o(t.target).index() : o(t.target).parent().index();
        t.preventDefault(), this.to(e, i.dotsSpeed);
      }, this)), this._overrides) this._core[t] = o.proxy(this[t], this);
    }, e.prototype.destroy = function () {
      var t, e, i, s, n = this._core.settings;
      for (t in this._handlers) this.$element.off(t, this._handlers[t]);
      for (e in this._controls) "$relative" === e && n.navContainer ? this._controls[e].html("") : this._controls[e].remove();
      for (s in this.overides) this._core[s] = this._overrides[s];
      for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null);
    }, e.prototype.update = function () {
      var t, e, i = this._core.clones().length / 2, s = i + this._core.items().length, n = this._core.maximum(true), o = this._core.settings, r = o.center || o.autoWidth || o.dotsData ? 1 : o.dotsEach || o.items;
      if ("page" !== o.slideBy && (o.slideBy = Math.min(o.slideBy, o.items)), o.dots || "page" == o.slideBy) for (this._pages = [], t = i, e = 0; t < s; t++) {
        if (r <= e || 0 === e) {
          if (this._pages.push({start: Math.min(n, t - i), end: t - i + r - 1}), Math.min(n, t - i) === n) break;
          e = 0, 0;
        }
        e += this._core.mergers(this._core.relative(t));
      }
    }, e.prototype.draw = function () {
      var t, e = this._core.settings, i = this._core.items().length <= e.items, s = this._core.relative(this._core.current()), n = e.loop || e.rewind;
      this._controls.$relative.toggleClass("disabled", !e.nav || i), e.nav && (this._controls.$previous.toggleClass("disabled", !n && s <= this._core.minimum(true)), this._controls.$next.toggleClass("disabled", !n && s >= this._core.maximum(true))), this._controls.$absolute.toggleClass("disabled", !e.dots || i), e.dots && (t = this._pages.length - this._controls.$absolute.children().length, e.dotsData && 0 != t ? this._controls.$absolute.html(this._templates.join("")) : 0 < t ? this._controls.$absolute.append(new Array(1 + t).join(this._templates[0])) : t < 0 && this._controls.$absolute.children().slice(t).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(o.inArray(this.current(), this._pages)).addClass("active"));
    }, e.prototype.onTrigger = function (t) {
      var e = this._core.settings;
      t.page = {index: o.inArray(this.current(), this._pages), count: this._pages.length, size: e && (e.center || e.autoWidth || e.dotsData ? 1 : e.dotsEach || e.items)};
    }, e.prototype.current = function () {
      var i = this._core.relative(this._core.current());
      return o.grep(this._pages, o.proxy(function (t, e) {
        return t.start <= i && t.end >= i;
      }, this)).pop();
    }, e.prototype.getPosition = function (t) {
      var e, i, s = this._core.settings;
      return "page" == s.slideBy ? (e = o.inArray(this.current(), this._pages), i = this._pages.length, t ? ++e : --e, e = this._pages[(e % i + i) % i].start) : (e = this._core.relative(this._core.current()), i = this._core.items().length, t ? e += s.slideBy : e -= s.slideBy), e;
    }, e.prototype.next = function (t) {
      o.proxy(this._overrides.to, this._core)(this.getPosition(true), t);
    }, e.prototype.prev = function (t) {
      o.proxy(this._overrides.to, this._core)(this.getPosition(false), t);
    }, e.prototype.to = function (t, e, i) {
      var s;
      !i && this._pages.length ? (s = this._pages.length, o.proxy(this._overrides.to, this._core)(this._pages[(t % s + s) % s].start, e)) : o.proxy(this._overrides.to, this._core)(t, e);
    }, o.fn.owlCarousel.Constructor.Plugins.Navigation = e;
  }(window.Zepto || window.jQuery, (window, document)), function (s, n) {
    "use strict";
    var e = function (t) {
      this._core = t, this._hashes = {}, this.$element = this._core.$element, this._handlers = {"initialized.owl.carousel": s.proxy(function (t) {
        t.namespace && "URLHash" === this._core.settings.startPosition && s(n).trigger("hashchange.owl.navigation");
      }, this), "prepared.owl.carousel": s.proxy(function (t) {
        if (t.namespace) {
          var e = s(t.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
          if (!e) return;
          this._hashes[e] = t.content;
        }
      }, this), "changed.owl.carousel": s.proxy(function (t) {
        if (t.namespace && "position" === t.property.name) {
          var i = this._core.items(this._core.relative(this._core.current())), e = s.map(this._hashes, function (t, e) {
            return t === i ? e : null;
          }).join();
          if (!e || n.location.hash.slice(1) === e) return;
          n.location.hash = e;
        }
      }, this)}, this._core.options = s.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), s(n).on("hashchange.owl.navigation", s.proxy(function (t) {
        var e = n.location.hash.substring(1), i = this._core.$stage.children(), s = this._hashes[e] && i.index(this._hashes[e]);
        void 0 !== s && s !== this._core.current() && this._core.to(this._core.relative(s), false, true);
      }, this));
    };
    e.Defaults = {URLhashListener: false}, e.prototype.destroy = function () {
      var t, e;
      for (t in s(n).off("hashchange.owl.navigation"), this._handlers) this._core.$element.off(t, this._handlers[t]);
      for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null);
    }, s.fn.owlCarousel.Constructor.Plugins.Hash = e;
  }(window.Zepto || window.jQuery, window, document), function (n, o) {
    var r = n("<support>").get(0).style, a = "Webkit Moz O ms".split(" "), t = {transition: {end: {WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", transition: "transitionend"}}, animation: {end: {WebkitAnimation: "webkitAnimationEnd", MozAnimation: "animationend", OAnimation: "oAnimationEnd", animation: "animationend"}}};
    function h(t, i) {
      var s = false, e = t.charAt(0).toUpperCase() + t.slice(1);
      return n.each((t + " " + a.join(e + " ") + e).split(" "), function (t, e) {
        if (r[e] !== o) return s = !i || e, false;
      }), s;
    }
    !function () {
      return !!h("transition");
    }() || (n.support.transition = new String(h("transition", true)), n.support.transition.end = t.transition.end[n.support.transition]), !!h("animation") && (n.support.animation = new String(h("animation", true)), n.support.animation.end = t.animation.end[n.support.animation]), !!h("transform") && (n.support.transform = new String(h("transform", true)), n.support.transform3d = !!h("perspective"));
  }(window.Zepto || window.jQuery, (window, void document));
  !function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("jquery")) : "function" == typeof define && define.amd ? define(["jquery"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Util = e(t.jQuery);
  }(this, function (i) {
    "use strict";
    i = i && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
    var e = "transitionend";
    function t(t) {
      var e = this, n = false;
      return i(this).one(s.TRANSITION_END, function () {
        n = true;
      }), setTimeout(function () {
        n || s.triggerTransitionEnd(e);
      }, t), this;
    }
    var s = {TRANSITION_END: "bsTransitionEnd", getUID: function (t) {
      for (; t += ~~(1e6 * Math.random()), document.getElementById(t);) ;
      return t;
    }, getSelectorFromElement: function (t) {
      var e, n = t.getAttribute("data-target");
      n && "#" !== n || (n = (e = t.getAttribute("href")) && "#" !== e ? e.trim() : "");
      try {
        return document.querySelector(n) ? n : null;
      } catch (t) {
        return null;
      }
    }, getTransitionDurationFromElement: function (t) {
      if (!t) return 0;
      var e = i(t).css("transition-duration"), n = i(t).css("transition-delay"), r = parseFloat(e), o = parseFloat(n);
      return r || o ? (e = e.split(",")[0], n = n.split(",")[0], 1e3 * (parseFloat(e) + parseFloat(n))) : 0;
    }, reflow: function (t) {
      return t.offsetHeight;
    }, triggerTransitionEnd: function (t) {
      i(t).trigger(e);
    }, supportsTransitionEnd: function () {
      return Boolean(e);
    }, isElement: function (t) {
      return (t[0] || t).nodeType;
    }, typeCheckConfig: function (t, e, n) {
      for (var r in n) if (Object.prototype.hasOwnProperty.call(n, r)) {
        var o = n[r], i = e[r], a = i && s.isElement(i) ? "element" : null == (u = i) ? "" + u : {}.toString.call(u).match(/\s([a-z]+)/i)[1].toLowerCase();
        if (!new RegExp(o).test(a)) throw new Error(t.toUpperCase() + ': Option "' + r + '" provided type "' + a + '" but expected type "' + o + '".');
      }
      var u;
    }, findShadowRoot: function (t) {
      if (!document.documentElement.attachShadow) return null;
      if ("function" != typeof t.getRootNode) return t instanceof ShadowRoot ? t : t.parentNode ? s.findShadowRoot(t.parentNode) : null;
      var e = t.getRootNode();
      return e instanceof ShadowRoot ? e : null;
    }, jQueryDetection: function () {
      if (void 0 === i) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
      var t = i.fn.jquery.split(" ")[0].split(".");
      if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0");
    }};
    return s.jQueryDetection(), i.fn.emulateTransitionEnd = t, i.event.special[s.TRANSITION_END] = {bindType: e, delegateType: e, handle: function (t) {
      if (i(t.target).is(this)) return t.handleObj.handler.apply(this, arguments);
    }}, s;
  });
  !function (r) {
    if (void 0 === r) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
    var t = r.fn.jquery.split(" ")[0].split(".");
    if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0]) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0");
  }($);
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("jquery"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "./util.js"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Alert = t(e.jQuery, e.Util);
  }(this, function (i, l) {
    "use strict";
    function s(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
      }
    }
    i = i && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i, l = l && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
    var e = "alert", u = "bs.alert", t = i.fn[e], n = function () {
      function r(e) {
        this._element = e;
      }
      var e, t, n, o = r.prototype;
      return o.close = function (e) {
        var t = this._element;
        e && (t = this._getRootElement(e)), this._triggerCloseEvent(t).isDefaultPrevented() || this._removeElement(t);
      }, o.dispose = function () {
        i.removeData(this._element, u), this._element = null;
      }, o._getRootElement = function (e) {
        var t = l.getSelectorFromElement(e), n = false;
        return t && (n = document.querySelector(t)), n = n || i(e).closest(".alert")[0];
      }, o._triggerCloseEvent = function (e) {
        var t = i.Event("close.bs.alert");
        return i(e).trigger(t), t;
      }, o._removeElement = function (t) {
        var e, n = this;
        i(t).removeClass("show"), i(t).hasClass("fade") ? (e = l.getTransitionDurationFromElement(t), i(t).one(l.TRANSITION_END, function (e) {
          return n._destroyElement(t, e);
        }).emulateTransitionEnd(e)) : this._destroyElement(t);
      }, o._destroyElement = function (e) {
        i(e).detach().trigger("closed.bs.alert").remove();
      }, r._jQueryInterface = function (n) {
        return this.each(function () {
          var e = i(this), t = e.data(u);
          t || (t = new r(this), e.data(u, t)), "close" === n && t[n](this);
        });
      }, r._handleDismiss = function (t) {
        return function (e) {
          e && e.preventDefault(), t.close(this);
        };
      }, e = r, n = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}], (t = null) && s(e.prototype, t), n && s(e, n), r;
    }();
    return i(document).on("click.bs.alert.data-api", '[data-dismiss="alert"]', n._handleDismiss(new n)), i.fn[e] = n._jQueryInterface, i.fn[e].Constructor = n, i.fn[e].noConflict = function () {
      return i.fn[e] = t, n._jQueryInterface;
    }, n;
  });
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("jquery")) : "function" == typeof define && define.amd ? define(["jquery"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Button = t(e.jQuery);
  }(this, function (o) {
    "use strict";
    function i(e, t) {
      for (var n = 0; n < t.length; n++) {
        var s = t[n];
        s.enumerable = s.enumerable || false, s.configurable = true, "value" in s && (s.writable = true), Object.defineProperty(e, s.key, s);
      }
    }
    o = o && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
    var e = "button", r = "bs.button", t = o.fn[e], l = "active", n = '[data-toggle^="button"]', c = 'input:not([type="hidden"])', a = ".btn", u = function () {
      function n(e) {
        this._element = e;
      }
      var e, t, s, a = n.prototype;
      return a.toggle = function () {
        var e, t, n = true, s = true, a = o(this._element).closest('[data-toggle="buttons"]')[0];
        !a || (e = this._element.querySelector(c)) && ("radio" === e.type && (e.checked && this._element.classList.contains(l) ? n = false : (t = a.querySelector(".active")) && o(t).removeClass(l)), n && ("checkbox" !== e.type && "radio" !== e.type || (e.checked = !this._element.classList.contains(l)), o(e).trigger("change")), e.focus(), s = false), this._element.hasAttribute("disabled") || this._element.classList.contains("disabled") || (s && this._element.setAttribute("aria-pressed", !this._element.classList.contains(l)), n && o(this._element).toggleClass(l));
      }, a.dispose = function () {
        o.removeData(this._element, r), this._element = null;
      }, n._jQueryInterface = function (t) {
        return this.each(function () {
          var e = o(this).data(r);
          e || (e = new n(this), o(this).data(r, e)), "toggle" === t && e[t]();
        });
      }, e = n, s = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}], (t = null) && i(e.prototype, t), s && i(e, s), n;
    }();
    return o(document).on("click.bs.button.data-api", n, function (e) {
      var t = e.target, n = t;
      if (o(t).hasClass("btn") || (t = o(t).closest(a)[0]), !t || t.hasAttribute("disabled") || t.classList.contains("disabled")) e.preventDefault(); else {
        var s = t.querySelector(c);
        if (s && (s.hasAttribute("disabled") || s.classList.contains("disabled"))) return void e.preventDefault();
        ("LABEL" !== n.tagName || s && "checkbox" !== s.type) && u._jQueryInterface.call(o(t), "toggle");
      }
    }).on("focus.bs.button.data-api blur.bs.button.data-api", n, function (e) {
      var t = o(e.target).closest(a)[0];
      o(t).toggleClass("focus", /^focus(in)?$/.test(e.type));
    }), o(window).on("load.bs.button.data-api", function () {
      for (var e = [].slice.call(document.querySelectorAll('[data-toggle="buttons"] .btn')), t = 0, n = e.length; t < n; t++) {
        var s = e[t], a = s.querySelector(c);
        a.checked || a.hasAttribute("checked") ? s.classList.add(l) : s.classList.remove(l);
      }
      for (var o = 0, i = (e = [].slice.call(document.querySelectorAll('[data-toggle="button"]'))).length; o < i; o++) {
        var r = e[o];
        "true" === r.getAttribute("aria-pressed") ? r.classList.add(l) : r.classList.remove(l);
      }
    }), o.fn[e] = u._jQueryInterface, o.fn[e].Constructor = u, o.fn[e].noConflict = function () {
      return o.fn[e] = t, u._jQueryInterface;
    }, u;
  });
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("jquery"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "./util.js"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Carousel = t(e.jQuery, e.Util);
  }(this, function (f, v) {
    "use strict";
    function o() {
      return (o = Object.assign || function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
        }
        return e;
      }).apply(this, arguments);
    }
    function s(e, t) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i];
        n.enumerable = n.enumerable || false, n.configurable = true, "value" in n && (n.writable = true), Object.defineProperty(e, n.key, n);
      }
    }
    f = f && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f, v = v && Object.prototype.hasOwnProperty.call(v, "default") ? v.default : v;
    var l = "carousel", a = "bs.carousel", u = "." + a, e = f.fn[l], c = {interval: 5e3, keyboard: true, slide: false, pause: "hover", wrap: true, touch: true}, h = {interval: "(number|boolean)", keyboard: "boolean", slide: "(boolean|string)", pause: "(string|boolean)", wrap: "boolean", touch: "boolean"}, m = "next", d = "prev", g = "slid" + u, p = "active", y = ".active.carousel-item", _ = {TOUCH: "touch", PEN: "pen"}, r = function () {
      function r(e, t) {
        this._items = null, this._interval = null, this._activeElement = null, this._isPaused = false, this._isSliding = false, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(t), this._element = e, this._indicatorsElement = this._element.querySelector(".carousel-indicators"), this._touchSupported = "ontouchstart" in document.documentElement || 0 < navigator.maxTouchPoints, this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent), this._addEventListeners();
      }
      var e, t, i, n = r.prototype;
      return n.next = function () {
        this._isSliding || this._slide(m);
      }, n.nextWhenVisible = function () {
        !document.hidden && f(this._element).is(":visible") && "hidden" !== f(this._element).css("visibility") && this.next();
      }, n.prev = function () {
        this._isSliding || this._slide(d);
      }, n.pause = function (e) {
        e || (this._isPaused = true), this._element.querySelector(".carousel-item-next, .carousel-item-prev") && (v.triggerTransitionEnd(this._element), this.cycle(true)), clearInterval(this._interval), this._interval = null;
      }, n.cycle = function (e) {
        e || (this._isPaused = false), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval));
      }, n.to = function (e) {
        var t = this;
        this._activeElement = this._element.querySelector(y);
        var i = this._getItemIndex(this._activeElement);
        if (!(e > this._items.length - 1 || e < 0)) if (this._isSliding) f(this._element).one(g, function () {
          return t.to(e);
        }); else {
          if (i === e) return this.pause(), void this.cycle();
          var n = i < e ? m : d;
          this._slide(n, this._items[e]);
        }
      }, n.dispose = function () {
        f(this._element).off(u), f.removeData(this._element, a), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null;
      }, n._getConfig = function (e) {
        return e = o({}, c, e), v.typeCheckConfig(l, e, h), e;
      }, n._handleSwipe = function () {
        var e, t = Math.abs(this.touchDeltaX);
        t <= 40 || (e = t / this.touchDeltaX, (this.touchDeltaX = 0) < e && this.prev(), e < 0 && this.next());
      }, n._addEventListeners = function () {
        var t = this;
        this._config.keyboard && f(this._element).on("keydown.bs.carousel", function (e) {
          return t._keydown(e);
        }), "hover" === this._config.pause && f(this._element).on("mouseenter.bs.carousel", function (e) {
          return t.pause(e);
        }).on("mouseleave.bs.carousel", function (e) {
          return t.cycle(e);
        }), this._config.touch && this._addTouchEventListeners();
      }, n._addTouchEventListeners = function () {
        var e, t, i = this;
        this._touchSupported && (e = function (e) {
          i._pointerEvent && _[e.originalEvent.pointerType.toUpperCase()] ? i.touchStartX = e.originalEvent.clientX : i._pointerEvent || (i.touchStartX = e.originalEvent.touches[0].clientX);
        }, t = function (e) {
          i._pointerEvent && _[e.originalEvent.pointerType.toUpperCase()] && (i.touchDeltaX = e.originalEvent.clientX - i.touchStartX), i._handleSwipe(), "hover" === i._config.pause && (i.pause(), i.touchTimeout && clearTimeout(i.touchTimeout), i.touchTimeout = setTimeout(function (e) {
            return i.cycle(e);
          }, 500 + i._config.interval));
        }, f(this._element.querySelectorAll(".carousel-item img")).on("dragstart.bs.carousel", function (e) {
          return e.preventDefault();
        }), this._pointerEvent ? (f(this._element).on("pointerdown.bs.carousel", e), f(this._element).on("pointerup.bs.carousel", t), this._element.classList.add("pointer-event")) : (f(this._element).on("touchstart.bs.carousel", e), f(this._element).on("touchmove.bs.carousel", function (e) {
          var t;
          (t = e).originalEvent.touches && 1 < t.originalEvent.touches.length ? i.touchDeltaX = 0 : i.touchDeltaX = t.originalEvent.touches[0].clientX - i.touchStartX;
        }), f(this._element).on("touchend.bs.carousel", t)));
      }, n._keydown = function (e) {
        if (!/input|textarea/i.test(e.target.tagName)) switch (e.which) {
          case 37:
            e.preventDefault(), this.prev();
            break;
          case 39:
            e.preventDefault(), this.next();
        }
      }, n._getItemIndex = function (e) {
        return this._items = e && e.parentNode ? [].slice.call(e.parentNode.querySelectorAll(".carousel-item")) : [], this._items.indexOf(e);
      }, n._getItemByDirection = function (e, t) {
        var i = e === m, n = e === d, s = this._getItemIndex(t), r = this._items.length - 1;
        if ((n && 0 === s || i && s === r) && !this._config.wrap) return t;
        var o = (s + (e === d ? -1 : 1)) % this._items.length;
        return -1 == o ? this._items[this._items.length - 1] : this._items[o];
      }, n._triggerSlideEvent = function (e, t) {
        var i = this._getItemIndex(e), n = this._getItemIndex(this._element.querySelector(y)), s = f.Event("slide.bs.carousel", {relatedTarget: e, direction: t, from: n, to: i});
        return f(this._element).trigger(s), s;
      }, n._setActiveIndicatorElement = function (e) {
        var t, i;
        this._indicatorsElement && (t = [].slice.call(this._indicatorsElement.querySelectorAll(".active")), f(t).removeClass(p), (i = this._indicatorsElement.children[this._getItemIndex(e)]) && f(i).addClass(p));
      }, n._slide = function (e, t) {
        var i, n, s, r, o, l = this, a = this._element.querySelector(y), u = this._getItemIndex(a), c = t || a && this._getItemByDirection(e, a), h = this._getItemIndex(c), d = Boolean(this._interval), _ = e === m ? (i = "carousel-item-left", n = "carousel-item-next", "left") : (i = "carousel-item-right", n = "carousel-item-prev", "right");
        c && f(c).hasClass(p) ? this._isSliding = false : this._triggerSlideEvent(c, _).isDefaultPrevented() || a && c && (this._isSliding = true, d && this.pause(), this._setActiveIndicatorElement(c), s = f.Event(g, {relatedTarget: c, direction: _, from: u, to: h}), f(this._element).hasClass("slide") ? (f(c).addClass(n), v.reflow(c), f(a).addClass(i), f(c).addClass(i), (r = parseInt(c.getAttribute("data-interval"), 10)) ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = r) : this._config.interval = this._config.defaultInterval || this._config.interval, o = v.getTransitionDurationFromElement(a), f(a).one(v.TRANSITION_END, function () {
          f(c).removeClass(i + " " + n).addClass(p), f(a).removeClass(p + " " + n + " " + i), l._isSliding = false, setTimeout(function () {
            return f(l._element).trigger(s);
          }, 0);
        }).emulateTransitionEnd(o)) : (f(a).removeClass(p), f(c).addClass(p), this._isSliding = false, f(this._element).trigger(s)), d && this.cycle());
      }, r._jQueryInterface = function (n) {
        return this.each(function () {
          var e = f(this).data(a), t = o({}, c, f(this).data());
          "object" == typeof n && (t = o({}, t, n));
          var i = "string" == typeof n ? n : t.slide;
          if (e || (e = new r(this, t), f(this).data(a, e)), "number" == typeof n) e.to(n); else if ("string" == typeof i) {
            if (void 0 === e[i]) throw new TypeError('No method named "' + i + '"');
            e[i]();
          } else t.interval && t.ride && (e.pause(), e.cycle());
        });
      }, r._dataApiClickHandler = function (e) {
        var t, i, n, s = v.getSelectorFromElement(this);
        !s || (t = f(s)[0]) && f(t).hasClass("carousel") && (i = o({}, f(t).data(), f(this).data()), (n = this.getAttribute("data-slide-to")) && (i.interval = false), r._jQueryInterface.call(f(t), i), n && f(t).data(a).to(n), e.preventDefault());
      }, e = r, i = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}, {key: "Default", get: function () {
        return c;
      }}], (t = null) && s(e.prototype, t), i && s(e, i), r;
    }();
    return f(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", r._dataApiClickHandler), f(window).on("load.bs.carousel.data-api", function () {
      for (var e = [].slice.call(document.querySelectorAll('[data-ride="carousel"]')), t = 0, i = e.length; t < i; t++) {
        var n = f(e[t]);
        r._jQueryInterface.call(n, n.data());
      }
    }), f.fn[l] = r._jQueryInterface, f.fn[l].Constructor = r, f.fn[l].noConflict = function () {
      return f.fn[l] = e, r._jQueryInterface;
    }, r;
  });
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("jquery"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "./util.js"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Collapse = t(e.jQuery, e.Util);
  }(this, function (o, c) {
    "use strict";
    function l() {
      return (l = Object.assign || function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
        }
        return e;
      }).apply(this, arguments);
    }
    function r(e, t) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n];
        i.enumerable = i.enumerable || false, i.configurable = true, "value" in i && (i.writable = true), Object.defineProperty(e, i.key, i);
      }
    }
    o = o && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o, c = c && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
    var s = "collapse", g = "bs.collapse", e = o.fn[s], h = {toggle: true, parent: ""}, u = {toggle: "boolean", parent: "(string|element)"}, f = "show", d = "collapse", _ = "collapsing", p = "collapsed", m = "width", y = '[data-toggle="collapse"]', a = function () {
      function a(t, e) {
        this._isTransitioning = false, this._element = t, this._config = this._getConfig(e), this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'));
        for (var n = [].slice.call(document.querySelectorAll(y)), i = 0, l = n.length; i < l; i++) {
          var r = n[i], s = c.getSelectorFromElement(r), a = [].slice.call(document.querySelectorAll(s)).filter(function (e) {
            return e === t;
          });
          null !== s && 0 < a.length && (this._selector = s, this._triggerArray.push(r));
        }
        this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle();
      }
      var e, t, n, i = a.prototype;
      return i.toggle = function () {
        o(this._element).hasClass(f) ? this.hide() : this.show();
      }, i.show = function () {
        var e, t, n, i, l, r, s = this;
        this._isTransitioning || o(this._element).hasClass(f) || (this._parent && 0 === (e = [].slice.call(this._parent.querySelectorAll(".show, .collapsing")).filter(function (e) {
          return "string" == typeof s._config.parent ? e.getAttribute("data-parent") === s._config.parent : e.classList.contains(d);
        })).length && (e = null), e && (t = o(e).not(this._selector).data(g)) && t._isTransitioning || (n = o.Event("show.bs.collapse"), o(this._element).trigger(n), n.isDefaultPrevented() || (e && (a._jQueryInterface.call(o(e).not(this._selector), "hide"), t || o(e).data(g, null)), i = this._getDimension(), o(this._element).removeClass(d).addClass(_), this._element.style[i] = 0, this._triggerArray.length && o(this._triggerArray).removeClass(p).attr("aria-expanded", true), this.setTransitioning(true), l = "scroll" + (i[0].toUpperCase() + i.slice(1)), r = c.getTransitionDurationFromElement(this._element), o(this._element).one(c.TRANSITION_END, function () {
          o(s._element).removeClass(_).addClass(d + " " + f), s._element.style[i] = "", s.setTransitioning(false), o(s._element).trigger("shown.bs.collapse");
        }).emulateTransitionEnd(r), this._element.style[i] = this._element[l] + "px")));
      }, i.hide = function () {
        var e = this;
        if (!this._isTransitioning && o(this._element).hasClass(f)) {
          var t = o.Event("hide.bs.collapse");
          if (o(this._element).trigger(t), !t.isDefaultPrevented()) {
            var n = this._getDimension();
            this._element.style[n] = this._element.getBoundingClientRect()[n] + "px", c.reflow(this._element), o(this._element).addClass(_).removeClass(d + " " + f);
            var i = this._triggerArray.length;
            if (0 < i) for (var l = 0; l < i; l++) {
              var r = this._triggerArray[l], s = c.getSelectorFromElement(r);
              null !== s && (o([].slice.call(document.querySelectorAll(s))).hasClass(f) || o(r).addClass(p).attr("aria-expanded", false));
            }
            this.setTransitioning(true);
            this._element.style[n] = "";
            var a = c.getTransitionDurationFromElement(this._element);
            o(this._element).one(c.TRANSITION_END, function () {
              e.setTransitioning(false), o(e._element).removeClass(_).addClass(d).trigger("hidden.bs.collapse");
            }).emulateTransitionEnd(a);
          }
        }
      }, i.setTransitioning = function (e) {
        this._isTransitioning = e;
      }, i.dispose = function () {
        o.removeData(this._element, g), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null;
      }, i._getConfig = function (e) {
        return (e = l({}, h, e)).toggle = Boolean(e.toggle), c.typeCheckConfig(s, e, u), e;
      }, i._getDimension = function () {
        return o(this._element).hasClass(m) ? m : "height";
      }, i._getParent = function () {
        var e, n = this;
        c.isElement(this._config.parent) ? (e = this._config.parent, void 0 !== this._config.parent.jquery && (e = this._config.parent[0])) : e = document.querySelector(this._config.parent);
        var t = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]', i = [].slice.call(e.querySelectorAll(t));
        return o(i).each(function (e, t) {
          n._addAriaAndCollapsedClass(a._getTargetFromElement(t), [t]);
        }), e;
      }, i._addAriaAndCollapsedClass = function (e, t) {
        var n = o(e).hasClass(f);
        t.length && o(t).toggleClass(p, !n).attr("aria-expanded", n);
      }, a._getTargetFromElement = function (e) {
        var t = c.getSelectorFromElement(e);
        return t ? document.querySelector(t) : null;
      }, a._jQueryInterface = function (i) {
        return this.each(function () {
          var e = o(this), t = e.data(g), n = l({}, h, e.data(), "object" == typeof i && i ? i : {});
          if (!t && n.toggle && "string" == typeof i && /show|hide/.test(i) && (n.toggle = false), t || (t = new a(this, n), e.data(g, t)), "string" == typeof i) {
            if (void 0 === t[i]) throw new TypeError('No method named "' + i + '"');
            t[i]();
          }
        });
      }, e = a, n = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}, {key: "Default", get: function () {
        return h;
      }}], (t = null) && r(e.prototype, t), n && r(e, n), a;
    }();
    return o(document).on("click.bs.collapse.data-api", y, function (e) {
      "A" === e.currentTarget.tagName && e.preventDefault();
      var n = o(this), t = c.getSelectorFromElement(this), i = [].slice.call(document.querySelectorAll(t));
      o(i).each(function () {
        var e = o(this), t = e.data(g) ? "toggle" : n.data();
        a._jQueryInterface.call(e, t);
      });
    }), o.fn[s] = a._jQueryInterface, o.fn[s].Constructor = a, o.fn[s].noConflict = function () {
      return o.fn[s] = e, a._jQueryInterface;
    }, a;
  });
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("jquery"), require("popper.js"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "popper.js", "./util.js"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Dropdown = t(e.jQuery, e.Popper, e.Util);
  }(this, function (f, i, s) {
    "use strict";
    function o() {
      return (o = Object.assign || function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
        return e;
      }).apply(this, arguments);
    }
    function a(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || false, r.configurable = true, "value" in r && (r.writable = true), Object.defineProperty(e, r.key, r);
      }
    }
    f = f && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f, i = i && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i, s = s && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
    var l = "dropdown", h = "bs.dropdown", p = "." + h, e = ".data-api", t = f.fn[l], c = new RegExp("38|40|27"), d = "hide" + p, g = "hidden" + p, n = "click" + p + e, r = "keydown" + p + e, m = "disabled", _ = "show", y = "dropdown-menu-right", v = '[data-toggle="dropdown"]', b = ".dropdown-menu", w = {offset: 0, flip: true, boundary: "scrollParent", reference: "toggle", display: "dynamic", popperConfig: null}, C = {offset: "(number|string|function)", flip: "boolean", boundary: "(string|element)", reference: "(string|element)", display: "string", popperConfig: "(null|object)"}, u = function () {
      function u(e, t) {
        this._element = e, this._popper = null, this._config = this._getConfig(t), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners();
      }
      var e, t, n, r = u.prototype;
      return r.toggle = function () {
        var e;
        this._element.disabled || f(this._element).hasClass(m) || (e = f(this._menu).hasClass(_), u._clearMenus(), e || this.show(true));
      }, r.show = function (e) {
        if (void 0 === e && (e = false), !(this._element.disabled || f(this._element).hasClass(m) || f(this._menu).hasClass(_))) {
          var t = {relatedTarget: this._element}, n = f.Event("show.bs.dropdown", t), r = u._getParentFromElement(this._element);
          if (f(r).trigger(n), !n.isDefaultPrevented()) {
            if (!this._inNavbar && e) {
              if (void 0 === i) throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");
              var o = this._element;
              "parent" === this._config.reference ? o = r : s.isElement(this._config.reference) && (o = this._config.reference, void 0 !== this._config.reference.jquery && (o = this._config.reference[0])), "scrollParent" !== this._config.boundary && f(r).addClass("position-static"), this._popper = new i(o, this._menu, this._getPopperConfig());
            }
            "ontouchstart" in document.documentElement && 0 === f(r).closest(".navbar-nav").length && f(document.body).children().on("mouseover", null, f.noop), this._element.focus(), this._element.setAttribute("aria-expanded", true), f(this._menu).toggleClass(_), f(r).toggleClass(_).trigger(f.Event("shown.bs.dropdown", t));
          }
        }
      }, r.hide = function () {
        var e, t, n;
        this._element.disabled || f(this._element).hasClass(m) || !f(this._menu).hasClass(_) || (e = {relatedTarget: this._element}, t = f.Event(d, e), n = u._getParentFromElement(this._element), f(n).trigger(t), t.isDefaultPrevented() || (this._popper && this._popper.destroy(), f(this._menu).toggleClass(_), f(n).toggleClass(_).trigger(f.Event(g, e))));
      }, r.dispose = function () {
        f.removeData(this._element, h), f(this._element).off(p), this._element = null, (this._menu = null) !== this._popper && (this._popper.destroy(), this._popper = null);
      }, r.update = function () {
        this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate();
      }, r._addEventListeners = function () {
        var t = this;
        f(this._element).on("click.bs.dropdown", function (e) {
          e.preventDefault(), e.stopPropagation(), t.toggle();
        });
      }, r._getConfig = function (e) {
        return e = o({}, this.constructor.Default, f(this._element).data(), e), s.typeCheckConfig(l, e, this.constructor.DefaultType), e;
      }, r._getMenuElement = function () {
        var e;
        return this._menu || (e = u._getParentFromElement(this._element)) && (this._menu = e.querySelector(b)), this._menu;
      }, r._getPlacement = function () {
        var e = f(this._element.parentNode), t = "bottom-start";
        return e.hasClass("dropup") ? t = f(this._menu).hasClass(y) ? "top-end" : "top-start" : e.hasClass("dropright") ? t = "right-start" : e.hasClass("dropleft") ? t = "left-start" : f(this._menu).hasClass(y) && (t = "bottom-end"), t;
      }, r._detectNavbar = function () {
        return 0 < f(this._element).closest(".navbar").length;
      }, r._getOffset = function () {
        var t = this, e = {};
        return "function" == typeof this._config.offset ? e.fn = function (e) {
          return e.offsets = o({}, e.offsets, t._config.offset(e.offsets, t._element) || {}), e;
        } : e.offset = this._config.offset, e;
      }, r._getPopperConfig = function () {
        var e = {placement: this._getPlacement(), modifiers: {offset: this._getOffset(), flip: {enabled: this._config.flip}, preventOverflow: {boundariesElement: this._config.boundary}}};
        return "static" === this._config.display && (e.modifiers.applyStyle = {enabled: false}), o({}, e, this._config.popperConfig);
      }, u._jQueryInterface = function (t) {
        return this.each(function () {
          var e = f(this).data(h);
          if (e || (e = new u(this, "object" == typeof t ? t : null), f(this).data(h, e)), "string" == typeof t) {
            if (void 0 === e[t]) throw new TypeError('No method named "' + t + '"');
            e[t]();
          }
        });
      }, u._clearMenus = function (e) {
        if (!e || 3 !== e.which && ("keyup" !== e.type || 9 === e.which)) for (var t = [].slice.call(document.querySelectorAll(v)), n = 0, r = t.length; n < r; n++) {
          var o, i, s = u._getParentFromElement(t[n]), a = f(t[n]).data(h), l = {relatedTarget: t[n]};
          e && "click" === e.type && (l.clickEvent = e), a && (o = a._menu, f(s).hasClass(_) && (e && ("click" === e.type && /input|textarea/i.test(e.target.tagName) || "keyup" === e.type && 9 === e.which) && f.contains(s, e.target) || (i = f.Event(d, l), f(s).trigger(i), i.isDefaultPrevented() || ("ontouchstart" in document.documentElement && f(document.body).children().off("mouseover", null, f.noop), t[n].setAttribute("aria-expanded", "false"), a._popper && a._popper.destroy(), f(o).removeClass(_), f(s).removeClass(_).trigger(f.Event(g, l))))));
        }
      }, u._getParentFromElement = function (e) {
        var t, n = s.getSelectorFromElement(e);
        return n && (t = document.querySelector(n)), t || e.parentNode;
      }, u._dataApiKeydownHandler = function (e) {
        if ((/input|textarea/i.test(e.target.tagName) ? !(32 === e.which || 27 !== e.which && (40 !== e.which && 38 !== e.which || f(e.target).closest(b).length)) : c.test(e.which)) && !this.disabled && !f(this).hasClass(m)) {
          var t = u._getParentFromElement(this), n = f(t).hasClass(_);
          if (n || 27 !== e.which) {
            if (e.preventDefault(), e.stopPropagation(), !n || n && (27 === e.which || 32 === e.which)) return 27 === e.which && f(t.querySelector(v)).trigger("focus"), void f(this).trigger("click");
            var r, o = [].slice.call(t.querySelectorAll(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)")).filter(function (e) {
              return f(e).is(":visible");
            });
            0 !== o.length && (r = o.indexOf(e.target), 38 === e.which && 0 < r && r--, 40 === e.which && r < o.length - 1 && r++, r < 0 && (r = 0), o[r].focus());
          }
        }
      }, e = u, n = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}, {key: "Default", get: function () {
        return w;
      }}, {key: "DefaultType", get: function () {
        return C;
      }}], (t = null) && a(e.prototype, t), n && a(e, n), u;
    }();
    return f(document).on(r, v, u._dataApiKeydownHandler).on(r, b, u._dataApiKeydownHandler).on(n + " keyup.bs.dropdown.data-api", u._clearMenus).on(n, v, function (e) {
      e.preventDefault(), e.stopPropagation(), u._jQueryInterface.call(f(this), "toggle");
    }).on(n, ".dropdown form", function (e) {
      e.stopPropagation();
    }), f.fn[l] = u._jQueryInterface, f.fn[l].Constructor = u, f.fn[l].noConflict = function () {
      return f.fn[l] = t, u._jQueryInterface;
    }, u;
  });
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("jquery"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "./util.js"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Modal = t(e.jQuery, e.Util);
  }(this, function (a, l) {
    "use strict";
    function r() {
      return (r = Object.assign || function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
        }
        return e;
      }).apply(this, arguments);
    }
    function s(e, t) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i];
        n.enumerable = n.enumerable || false, n.configurable = true, "value" in n && (n.writable = true), Object.defineProperty(e, n.key, n);
      }
    }
    a = a && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a, l = l && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
    var d = "modal", h = "bs.modal", c = "." + h, e = a.fn[d], u = {backdrop: true, keyboard: true, focus: true, show: true}, _ = {backdrop: "(boolean|string)", keyboard: "boolean", focus: "boolean", show: "boolean"}, m = "hidden" + c, f = "show" + c, g = "focusin" + c, p = "resize" + c, b = "click.dismiss" + c, v = "keydown.dismiss" + c, y = "mousedown.dismiss" + c, w = "modal-open", k = "fade", T = "show", E = "modal-static", S = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", N = ".sticky-top", C = function () {
      function o(e, t) {
        this._config = this._getConfig(t), this._element = e, this._dialog = e.querySelector(".modal-dialog"), this._backdrop = null, this._isShown = false, this._isBodyOverflowing = false, this._ignoreBackdropClick = false, this._isTransitioning = false, this._scrollbarWidth = 0;
      }
      var e, t, i, n = o.prototype;
      return n.toggle = function (e) {
        return this._isShown ? this.hide() : this.show(e);
      }, n.show = function (e) {
        var t, i = this;
        this._isShown || this._isTransitioning || (a(this._element).hasClass(k) && (this._isTransitioning = true), t = a.Event(f, {relatedTarget: e}), a(this._element).trigger(t), this._isShown || t.isDefaultPrevented() || (this._isShown = true, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), a(this._element).on(b, '[data-dismiss="modal"]', function (e) {
          return i.hide(e);
        }), a(this._dialog).on(y, function () {
          a(i._element).one("mouseup.dismiss.bs.modal", function (e) {
            a(e.target).is(i._element) && (i._ignoreBackdropClick = true);
          });
        }), this._showBackdrop(function () {
          return i._showElement(e);
        })));
      }, n.hide = function (e) {
        var t, i, n, o = this;
        e && e.preventDefault(), this._isShown && !this._isTransitioning && (t = a.Event("hide.bs.modal"), a(this._element).trigger(t), this._isShown && !t.isDefaultPrevented() && (this._isShown = false, (i = a(this._element).hasClass(k)) && (this._isTransitioning = true), this._setEscapeEvent(), this._setResizeEvent(), a(document).off(g), a(this._element).removeClass(T), a(this._element).off(b), a(this._dialog).off(y), i ? (n = l.getTransitionDurationFromElement(this._element), a(this._element).one(l.TRANSITION_END, function (e) {
          return o._hideModal(e);
        }).emulateTransitionEnd(n)) : this._hideModal()));
      }, n.dispose = function () {
        [window, this._element, this._dialog].forEach(function (e) {
          return a(e).off(c);
        }), a(document).off(g), a.removeData(this._element, h), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null;
      }, n.handleUpdate = function () {
        this._adjustDialog();
      }, n._getConfig = function (e) {
        return e = r({}, u, e), l.typeCheckConfig(d, e, _), e;
      }, n._triggerBackdropTransition = function () {
        var e = this;
        if ("static" === this._config.backdrop) {
          var t = a.Event("hidePrevented.bs.modal");
          if (a(this._element).trigger(t), t.defaultPrevented) return;
          var i = this._element.scrollHeight > document.documentElement.clientHeight;
          i || (this._element.style.overflowY = "hidden"), this._element.classList.add(E);
          var n = l.getTransitionDurationFromElement(this._dialog);
          a(this._element).off(l.TRANSITION_END), a(this._element).one(l.TRANSITION_END, function () {
            e._element.classList.remove(E), i || a(e._element).one(l.TRANSITION_END, function () {
              e._element.style.overflowY = "";
            }).emulateTransitionEnd(e._element, n);
          }).emulateTransitionEnd(n), this._element.focus();
        } else this.hide();
      }, n._showElement = function (e) {
        var t = this, i = a(this._element).hasClass(k), n = this._dialog ? this._dialog.querySelector(".modal-body") : null;
        this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", true), this._element.setAttribute("role", "dialog"), a(this._dialog).hasClass("modal-dialog-scrollable") && n ? n.scrollTop = 0 : this._element.scrollTop = 0, i && l.reflow(this._element), a(this._element).addClass(T), this._config.focus && this._enforceFocus();
        function o() {
          t._config.focus && t._element.focus(), t._isTransitioning = false, a(t._element).trigger(r);
        }
        var s, r = a.Event("shown.bs.modal", {relatedTarget: e});
        i ? (s = l.getTransitionDurationFromElement(this._dialog), a(this._dialog).one(l.TRANSITION_END, o).emulateTransitionEnd(s)) : o();
      }, n._enforceFocus = function () {
        var t = this;
        a(document).off(g).on(g, function (e) {
          document !== e.target && t._element !== e.target && 0 === a(t._element).has(e.target).length && t._element.focus();
        });
      }, n._setEscapeEvent = function () {
        var t = this;
        this._isShown ? a(this._element).on(v, function (e) {
          t._config.keyboard && 27 === e.which ? (e.preventDefault(), t.hide()) : t._config.keyboard || 27 !== e.which || t._triggerBackdropTransition();
        }) : this._isShown || a(this._element).off(v);
      }, n._setResizeEvent = function () {
        var t = this;
        this._isShown ? a(window).on(p, function (e) {
          return t.handleUpdate(e);
        }) : a(window).off(p);
      }, n._hideModal = function () {
        var e = this;
        this._element.style.display = "none", this._element.setAttribute("aria-hidden", true), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = false, this._showBackdrop(function () {
          a(document.body).removeClass(w), e._resetAdjustments(), e._resetScrollbar(), a(e._element).trigger(m);
        });
      }, n._removeBackdrop = function () {
        this._backdrop && (a(this._backdrop).remove(), this._backdrop = null);
      }, n._showBackdrop = function (e) {
        var t, i, n = this, o = a(this._element).hasClass(k) ? k : "";
        if (this._isShown && this._config.backdrop) {
          if (this._backdrop = document.createElement("div"), this._backdrop.className = "modal-backdrop", o && this._backdrop.classList.add(o), a(this._backdrop).appendTo(document.body), a(this._element).on(b, function (e) {
            n._ignoreBackdropClick ? n._ignoreBackdropClick = false : e.target === e.currentTarget && n._triggerBackdropTransition();
          }), o && l.reflow(this._backdrop), a(this._backdrop).addClass(T), !e) return;
          if (!o) return void e();
          var s = l.getTransitionDurationFromElement(this._backdrop);
          a(this._backdrop).one(l.TRANSITION_END, e).emulateTransitionEnd(s);
        } else {
          !this._isShown && this._backdrop ? (a(this._backdrop).removeClass(T), t = function () {
            n._removeBackdrop(), e && e();
          }, a(this._element).hasClass(k) ? (i = l.getTransitionDurationFromElement(this._backdrop), a(this._backdrop).one(l.TRANSITION_END, t).emulateTransitionEnd(i)) : t()) : e && e();
        }
      }, n._adjustDialog = function () {
        var e = this._element.scrollHeight > document.documentElement.clientHeight;
        !this._isBodyOverflowing && e && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !e && (this._element.style.paddingRight = this._scrollbarWidth + "px");
      }, n._resetAdjustments = function () {
        this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
      }, n._checkScrollbar = function () {
        var e = document.body.getBoundingClientRect();
        this._isBodyOverflowing = Math.round(e.left + e.right) < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth();
      }, n._setScrollbar = function () {
        var e, t, i, n, o = this;
        this._isBodyOverflowing && (e = [].slice.call(document.querySelectorAll(S)), t = [].slice.call(document.querySelectorAll(N)), a(e).each(function (e, t) {
          var i = t.style.paddingRight, n = a(t).css("padding-right");
          a(t).data("padding-right", i).css("padding-right", parseFloat(n) + o._scrollbarWidth + "px");
        }), a(t).each(function (e, t) {
          var i = t.style.marginRight, n = a(t).css("margin-right");
          a(t).data("margin-right", i).css("margin-right", parseFloat(n) - o._scrollbarWidth + "px");
        }), i = document.body.style.paddingRight, n = a(document.body).css("padding-right"), a(document.body).data("padding-right", i).css("padding-right", parseFloat(n) + this._scrollbarWidth + "px")), a(document.body).addClass(w);
      }, n._resetScrollbar = function () {
        var e = [].slice.call(document.querySelectorAll(S));
        a(e).each(function (e, t) {
          var i = a(t).data("padding-right");
          a(t).removeData("padding-right"), t.style.paddingRight = i || "";
        });
        var t = [].slice.call(document.querySelectorAll(N));
        a(t).each(function (e, t) {
          var i = a(t).data("margin-right");
          void 0 !== i && a(t).css("margin-right", i).removeData("margin-right");
        });
        var i = a(document.body).data("padding-right");
        a(document.body).removeData("padding-right"), document.body.style.paddingRight = i || "";
      }, n._getScrollbarWidth = function () {
        var e = document.createElement("div");
        e.className = "modal-scrollbar-measure", document.body.appendChild(e);
        var t = e.getBoundingClientRect().width - e.clientWidth;
        return document.body.removeChild(e), t;
      }, o._jQueryInterface = function (i, n) {
        return this.each(function () {
          var e = a(this).data(h), t = r({}, u, a(this).data(), "object" == typeof i && i ? i : {});
          if (e || (e = new o(this, t), a(this).data(h, e)), "string" == typeof i) {
            if (void 0 === e[i]) throw new TypeError('No method named "' + i + '"');
            e[i](n);
          } else t.show && e.show(n);
        });
      }, e = o, i = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}, {key: "Default", get: function () {
        return u;
      }}], (t = null) && s(e.prototype, t), i && s(e, i), o;
    }();
    return a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (e) {
      var t, i = this, n = l.getSelectorFromElement(this);
      n && (t = document.querySelector(n));
      var o = a(t).data(h) ? "toggle" : r({}, a(t).data(), a(this).data());
      "A" !== this.tagName && "AREA" !== this.tagName || e.preventDefault();
      var s = a(t).one(f, function (e) {
        e.isDefaultPrevented() || s.one(m, function () {
          a(i).is(":visible") && i.focus();
        });
      });
      C._jQueryInterface.call(a(t), o, this);
    }), a.fn[d] = C._jQueryInterface, a.fn[d].Constructor = C, a.fn[d].noConflict = function () {
      return a.fn[d] = e, C._jQueryInterface;
    }, C;
  });
  !function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("jquery"), require("popper.js"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "popper.js", "./util.js"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Tooltip = e(t.jQuery, t.Popper, t.Util);
  }(this, function (u, f, g) {
    "use strict";
    u = u && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u, f = f && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f, g = g && Object.prototype.hasOwnProperty.call(g, "default") ? g.default : g;
    var c = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"], t = {"*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i], a: ["target", "href", "title", "rel"], area: [], b: [], br: [], col: [], code: [], div: [], em: [], hr: [], h1: [], h2: [], h3: [], h4: [], h5: [], h6: [], i: [], img: ["src", "srcset", "alt", "title", "width", "height"], li: [], ol: [], p: [], pre: [], s: [], small: [], span: [], sub: [], sup: [], strong: [], u: [], ul: []}, h = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi, p = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
    function r(t, r, e) {
      if (0 === t.length) return t;
      if (e && "function" == typeof e) return e(t);
      for (var n = (new window.DOMParser).parseFromString(t, "text/html"), s = Object.keys(r), a = [].slice.call(n.body.querySelectorAll("*")), i = function (t) {
        var e = a[t], n = e.nodeName.toLowerCase();
        if (-1 === s.indexOf(e.nodeName.toLowerCase())) return e.parentNode.removeChild(e), "continue";
        var i = [].slice.call(e.attributes), o = [].concat(r["*"] || [], r[n] || []);
        i.forEach(function (t) {
          !function (t, e) {
            var n = t.nodeName.toLowerCase();
            if (-1 !== e.indexOf(n)) return -1 === c.indexOf(n) || Boolean(t.nodeValue.match(h) || t.nodeValue.match(p));
            for (var i = e.filter(function (t) {
              return t instanceof RegExp;
            }), o = 0, r = i.length; o < r; o++) if (n.match(i[o])) return 1;
          }(t, o) && e.removeAttribute(t.nodeName);
        });
      }, o = 0, l = a.length; o < l; o++) i(o);
      return n.body.innerHTML;
    }
    function s() {
      return (s = Object.assign || function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
        }
        return t;
      }).apply(this, arguments);
    }
    function a(t, e) {
      for (var n = 0; n < e.length; n++) {
        var i = e[n];
        i.enumerable = i.enumerable || false, i.configurable = true, "value" in i && (i.writable = true), Object.defineProperty(t, i.key, i);
      }
    }
    var l = "tooltip", d = "bs.tooltip", m = "." + d, e = u.fn[l], v = "bs-tooltip", _ = new RegExp("(^|\\s)" + v + "\\S+", "g"), E = ["sanitize", "whiteList", "sanitizeFn"], b = {animation: "boolean", template: "string", title: "(string|element|function)", trigger: "string", delay: "(number|object)", html: "boolean", selector: "(string|boolean)", placement: "(string|function)", offset: "(number|string|function)", container: "(string|element|boolean)", fallbackPlacement: "(string|array)", boundary: "(string|element)", sanitize: "boolean", sanitizeFn: "(null|function)", whiteList: "object", popperConfig: "(null|object)"}, T = {AUTO: "auto", TOP: "top", RIGHT: "right", BOTTOM: "bottom", LEFT: "left"}, y = {animation: true, template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: false, selector: false, placement: "top", offset: 0, container: false, fallbackPlacement: "flip", boundary: "scrollParent", sanitize: true, sanitizeFn: null, whiteList: t, popperConfig: null}, C = "show", w = "out", A = {HIDE: "hide" + m, HIDDEN: "hidden" + m, SHOW: "show" + m, SHOWN: "shown" + m, INSERTED: "inserted" + m, CLICK: "click" + m, FOCUSIN: "focusin" + m, FOCUSOUT: "focusout" + m, MOUSEENTER: "mouseenter" + m, MOUSELEAVE: "mouseleave" + m}, O = "fade", S = "show", D = "hover", j = "focus", n = function () {
      function i(t, e) {
        if (void 0 === f) throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");
        this._isEnabled = true, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = t, this.config = this._getConfig(e), this.tip = null, this._setListeners();
      }
      var t, e, n, o = i.prototype;
      return o.enable = function () {
        this._isEnabled = true;
      }, o.disable = function () {
        this._isEnabled = false;
      }, o.toggleEnabled = function () {
        this._isEnabled = !this._isEnabled;
      }, o.toggle = function (t) {
        if (this._isEnabled) if (t) {
          var e = this.constructor.DATA_KEY, n = u(t.currentTarget).data(e);
          n || (n = new this.constructor(t.currentTarget, this._getDelegateConfig()), u(t.currentTarget).data(e, n)), n._activeTrigger.click = !n._activeTrigger.click, n._isWithActiveTrigger() ? n._enter(null, n) : n._leave(null, n);
        } else {
          if (u(this.getTipElement()).hasClass(S)) return void this._leave(null, this);
          this._enter(null, this);
        }
      }, o.dispose = function () {
        clearTimeout(this._timeout), u.removeData(this.element, this.constructor.DATA_KEY), u(this.element).off(this.constructor.EVENT_KEY), u(this.element).closest(".modal").off("hide.bs.modal", this._hideModalHandler), this.tip && u(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, this._activeTrigger = null, this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null;
      }, o.show = function () {
        var e = this;
        if ("none" === u(this.element).css("display")) throw new Error("Please use show on visible elements");
        var t = u.Event(this.constructor.Event.SHOW);
        if (this.isWithContent() && this._isEnabled) {
          u(this.element).trigger(t);
          var n = g.findShadowRoot(this.element), i = u.contains(null !== n ? n : this.element.ownerDocument.documentElement, this.element);
          if (t.isDefaultPrevented() || !i) return;
          var o = this.getTipElement(), r = g.getUID(this.constructor.NAME);
          o.setAttribute("id", r), this.element.setAttribute("aria-describedby", r), this.setContent(), this.config.animation && u(o).addClass(O);
          var s = "function" == typeof this.config.placement ? this.config.placement.call(this, o, this.element) : this.config.placement, a = this._getAttachment(s);
          this.addAttachmentClass(a);
          var l = this._getContainer();
          u(o).data(this.constructor.DATA_KEY, this), u.contains(this.element.ownerDocument.documentElement, this.tip) || u(o).appendTo(l), u(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new f(this.element, o, this._getPopperConfig(a)), u(o).addClass(S), "ontouchstart" in document.documentElement && u(document.body).children().on("mouseover", null, u.noop);
          var c, h = function () {
            e.config.animation && e._fixTransition();
            var t = e._hoverState;
            e._hoverState = null, u(e.element).trigger(e.constructor.Event.SHOWN), t === w && e._leave(null, e);
          };
          u(this.tip).hasClass(O) ? (c = g.getTransitionDurationFromElement(this.tip), u(this.tip).one(g.TRANSITION_END, h).emulateTransitionEnd(c)) : h();
        }
      }, o.hide = function (t) {
        function e() {
          i._hoverState !== C && o.parentNode && o.parentNode.removeChild(o), i._cleanTipClass(), i.element.removeAttribute("aria-describedby"), u(i.element).trigger(i.constructor.Event.HIDDEN), null !== i._popper && i._popper.destroy(), t && t();
        }
        var n, i = this, o = this.getTipElement(), r = u.Event(this.constructor.Event.HIDE);
        u(this.element).trigger(r), r.isDefaultPrevented() || (u(o).removeClass(S), "ontouchstart" in document.documentElement && u(document.body).children().off("mouseover", null, u.noop), this._activeTrigger.click = false, this._activeTrigger[j] = false, this._activeTrigger[D] = false, u(this.tip).hasClass(O) ? (n = g.getTransitionDurationFromElement(o), u(o).one(g.TRANSITION_END, e).emulateTransitionEnd(n)) : e(), this._hoverState = "");
      }, o.update = function () {
        null !== this._popper && this._popper.scheduleUpdate();
      }, o.isWithContent = function () {
        return Boolean(this.getTitle());
      }, o.addAttachmentClass = function (t) {
        u(this.getTipElement()).addClass(v + "-" + t);
      }, o.getTipElement = function () {
        return this.tip = this.tip || u(this.config.template)[0], this.tip;
      }, o.setContent = function () {
        var t = this.getTipElement();
        this.setElementContent(u(t.querySelectorAll(".tooltip-inner")), this.getTitle()), u(t).removeClass(O + " " + S);
      }, o.setElementContent = function (t, e) {
        "object" != typeof e || !e.nodeType && !e.jquery ? this.config.html ? (this.config.sanitize && (e = r(e, this.config.whiteList, this.config.sanitizeFn)), t.html(e)) : t.text(e) : this.config.html ? u(e).parent().is(t) || t.empty().append(e) : t.text(u(e).text());
      }, o.getTitle = function () {
        return this.element.getAttribute("data-original-title") || ("function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title);
      }, o._getPopperConfig = function (t) {
        var e = this;
        return s({}, {placement: t, modifiers: {offset: this._getOffset(), flip: {behavior: this.config.fallbackPlacement}, arrow: {element: ".arrow"}, preventOverflow: {boundariesElement: this.config.boundary}}, onCreate: function (t) {
          t.originalPlacement !== t.placement && e._handlePopperPlacementChange(t);
        }, onUpdate: function (t) {
          return e._handlePopperPlacementChange(t);
        }}, this.config.popperConfig);
      }, o._getOffset = function () {
        var e = this, t = {};
        return "function" == typeof this.config.offset ? t.fn = function (t) {
          return t.offsets = s({}, t.offsets, e.config.offset(t.offsets, e.element) || {}), t;
        } : t.offset = this.config.offset, t;
      }, o._getContainer = function () {
        return false === this.config.container ? document.body : g.isElement(this.config.container) ? u(this.config.container) : u(document).find(this.config.container);
      }, o._getAttachment = function (t) {
        return T[t.toUpperCase()];
      }, o._setListeners = function () {
        var i = this;
        this.config.trigger.split(" ").forEach(function (t) {
          var e, n;
          "click" === t ? u(i.element).on(i.constructor.Event.CLICK, i.config.selector, function (t) {
            return i.toggle(t);
          }) : "manual" !== t && (e = t === D ? i.constructor.Event.MOUSEENTER : i.constructor.Event.FOCUSIN, n = t === D ? i.constructor.Event.MOUSELEAVE : i.constructor.Event.FOCUSOUT, u(i.element).on(e, i.config.selector, function (t) {
            return i._enter(t);
          }).on(n, i.config.selector, function (t) {
            return i._leave(t);
          }));
        }), this._hideModalHandler = function () {
          i.element && i.hide();
        }, u(this.element).closest(".modal").on("hide.bs.modal", this._hideModalHandler), this.config.selector ? this.config = s({}, this.config, {trigger: "manual", selector: ""}) : this._fixTitle();
      }, o._fixTitle = function () {
        var t = typeof this.element.getAttribute("data-original-title");
        !this.element.getAttribute("title") && "string" == t || (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""));
      }, o._enter = function (t, e) {
        var n = this.constructor.DATA_KEY;
        (e = e || u(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget, this._getDelegateConfig()), u(t.currentTarget).data(n, e)), t && (e._activeTrigger["focusin" === t.type ? j : D] = true), u(e.getTipElement()).hasClass(S) || e._hoverState === C ? e._hoverState = C : (clearTimeout(e._timeout), e._hoverState = C, e.config.delay && e.config.delay.show ? e._timeout = setTimeout(function () {
          e._hoverState === C && e.show();
        }, e.config.delay.show) : e.show());
      }, o._leave = function (t, e) {
        var n = this.constructor.DATA_KEY;
        (e = e || u(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget, this._getDelegateConfig()), u(t.currentTarget).data(n, e)), t && (e._activeTrigger["focusout" === t.type ? j : D] = false), e._isWithActiveTrigger() || (clearTimeout(e._timeout), e._hoverState = w, e.config.delay && e.config.delay.hide ? e._timeout = setTimeout(function () {
          e._hoverState === w && e.hide();
        }, e.config.delay.hide) : e.hide());
      }, o._isWithActiveTrigger = function () {
        for (var t in this._activeTrigger) if (this._activeTrigger[t]) return true;
        return false;
      }, o._getConfig = function (t) {
        var e = u(this.element).data();
        return Object.keys(e).forEach(function (t) {
          -1 !== E.indexOf(t) && delete e[t];
        }), "number" == typeof (t = s({}, this.constructor.Default, e, "object" == typeof t && t ? t : {})).delay && (t.delay = {show: t.delay, hide: t.delay}), "number" == typeof t.title && (t.title = t.title.toString()), "number" == typeof t.content && (t.content = t.content.toString()), g.typeCheckConfig(l, t, this.constructor.DefaultType), t.sanitize && (t.template = r(t.template, t.whiteList, t.sanitizeFn)), t;
      }, o._getDelegateConfig = function () {
        var t = {};
        if (this.config) for (var e in this.config) this.constructor.Default[e] !== this.config[e] && (t[e] = this.config[e]);
        return t;
      }, o._cleanTipClass = function () {
        var t = u(this.getTipElement()), e = t.attr("class").match(_);
        null !== e && e.length && t.removeClass(e.join(""));
      }, o._handlePopperPlacementChange = function (t) {
        this.tip = t.instance.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(t.placement));
      }, o._fixTransition = function () {
        var t = this.getTipElement(), e = this.config.animation;
        null === t.getAttribute("x-placement") && (u(t).removeClass(O), this.config.animation = false, this.hide(), this.show(), this.config.animation = e);
      }, i._jQueryInterface = function (n) {
        return this.each(function () {
          var t = u(this).data(d), e = "object" == typeof n && n;
          if ((t || !/dispose|hide/.test(n)) && (t || (t = new i(this, e), u(this).data(d, t)), "string" == typeof n)) {
            if (void 0 === t[n]) throw new TypeError('No method named "' + n + '"');
            t[n]();
          }
        });
      }, t = i, n = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}, {key: "Default", get: function () {
        return y;
      }}, {key: "NAME", get: function () {
        return l;
      }}, {key: "DATA_KEY", get: function () {
        return d;
      }}, {key: "Event", get: function () {
        return A;
      }}, {key: "EVENT_KEY", get: function () {
        return m;
      }}, {key: "DefaultType", get: function () {
        return b;
      }}], (e = null) && a(t.prototype, e), n && a(t, n), i;
    }();
    return u.fn[l] = n._jQueryInterface, u.fn[l].Constructor = n, u.fn[l].noConflict = function () {
      return u.fn[l] = e, n._jQueryInterface;
    }, n;
  });
  !function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("jquery"), require("./tooltip.js")) : "function" == typeof define && define.amd ? define(["jquery", "./tooltip.js"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Popover = e(t.jQuery, t.Tooltip);
  }(this, function (a, t) {
    "use strict";
    function l(t, e) {
      for (var n = 0; n < e.length; n++) {
        var o = e[n];
        o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(t, o.key, o);
      }
    }
    function e() {
      return (e = Object.assign || function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
        }
        return t;
      }).apply(this, arguments);
    }
    a = a && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a, t = t && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
    var p = "popover", c = "bs.popover", f = "." + c, n = a.fn[p], h = "bs-popover", d = new RegExp("(^|\\s)" + h + "\\S+", "g"), y = e({}, t.Default, {placement: "right", trigger: "click", content: "", template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}), g = e({}, t.DefaultType, {content: "(string|element|function)"}), v = {HIDE: "hide" + f, HIDDEN: "hidden" + f, SHOW: "show" + f, SHOWN: "shown" + f, INSERTED: "inserted" + f, CLICK: "click" + f, FOCUSIN: "focusin" + f, FOCUSOUT: "focusout" + f, MOUSEENTER: "mouseenter" + f, MOUSELEAVE: "mouseleave" + f}, o = function (t) {
      var e, n;
      n = t, (e = o).prototype = Object.create(n.prototype), (e.prototype.constructor = e).__proto__ = n;
      var r, i, s, u = o.prototype;
      return u.isWithContent = function () {
        return this.getTitle() || this._getContent();
      }, u.addAttachmentClass = function (t) {
        a(this.getTipElement()).addClass(h + "-" + t);
      }, u.getTipElement = function () {
        return this.tip = this.tip || a(this.config.template)[0], this.tip;
      }, u.setContent = function () {
        var t = a(this.getTipElement());
        this.setElementContent(t.find(".popover-header"), this.getTitle());
        var e = this._getContent();
        "function" == typeof e && (e = e.call(this.element)), this.setElementContent(t.find(".popover-body"), e), t.removeClass("fade show");
      }, u._getContent = function () {
        return this.element.getAttribute("data-content") || this.config.content;
      }, u._cleanTipClass = function () {
        var t = a(this.getTipElement()), e = t.attr("class").match(d);
        null !== e && 0 < e.length && t.removeClass(e.join(""));
      }, o._jQueryInterface = function (n) {
        return this.each(function () {
          var t = a(this).data(c), e = "object" == typeof n ? n : null;
          if ((t || !/dispose|hide/.test(n)) && (t || (t = new o(this, e), a(this).data(c, t)), "string" == typeof n)) {
            if (void 0 === t[n]) throw new TypeError('No method named "' + n + '"');
            t[n]();
          }
        });
      }, r = o, s = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}, {key: "Default", get: function () {
        return y;
      }}, {key: "NAME", get: function () {
        return p;
      }}, {key: "DATA_KEY", get: function () {
        return c;
      }}, {key: "Event", get: function () {
        return v;
      }}, {key: "EVENT_KEY", get: function () {
        return f;
      }}, {key: "DefaultType", get: function () {
        return g;
      }}], (i = null) && l(r.prototype, i), s && l(r, s), o;
    }(t);
    return a.fn[p] = o._jQueryInterface, a.fn[p].Constructor = o, a.fn[p].noConflict = function () {
      return a.fn[p] = n, o._jQueryInterface;
    }, o;
  });
  !function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("jquery"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "./util.js"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).ScrollSpy = e(t.jQuery, t.Util);
  }(this, function (n, l) {
    "use strict";
    function o() {
      return (o = Object.assign || function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var r = arguments[e];
          for (var s in r) Object.prototype.hasOwnProperty.call(r, s) && (t[s] = r[s]);
        }
        return t;
      }).apply(this, arguments);
    }
    function c(t, e) {
      for (var r = 0; r < e.length; r++) {
        var s = e[r];
        s.enumerable = s.enumerable || false, s.configurable = true, "value" in s && (s.writable = true), Object.defineProperty(t, s.key, s);
      }
    }
    n = n && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n, l = l && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
    var a = "scrollspy", f = "bs.scrollspy", h = "." + f, t = n.fn[a], u = {offset: 10, method: "auto", target: ""}, g = {offset: "number", method: "string", target: "(string|element)"}, _ = "active", d = ".nav, .list-group", p = ".nav-link", m = ".list-group-item", y = "position", s = function () {
      function r(t, e) {
        var r = this;
        this._element = t, this._scrollElement = "BODY" === t.tagName ? window : t, this._config = this._getConfig(e), this._selector = this._config.target + " " + p + "," + this._config.target + " " + m + "," + this._config.target + " .dropdown-item", this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, n(this._scrollElement).on("scroll.bs.scrollspy", function (t) {
          return r._process(t);
        }), this.refresh(), this._process();
      }
      var t, e, s, i = r.prototype;
      return i.refresh = function () {
        var e = this, t = this._scrollElement === this._scrollElement.window ? "offset" : y, i = "auto" === this._config.method ? t : this._config.method, o = i === y ? this._getScrollTop() : 0;
        this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function (t) {
          var e, r = l.getSelectorFromElement(t);
          if (r && (e = document.querySelector(r)), e) {
            var s = e.getBoundingClientRect();
            if (s.width || s.height) return [n(e)[i]().top + o, r];
          }
          return null;
        }).filter(function (t) {
          return t;
        }).sort(function (t, e) {
          return t[0] - e[0];
        }).forEach(function (t) {
          e._offsets.push(t[0]), e._targets.push(t[1]);
        });
      }, i.dispose = function () {
        n.removeData(this._element, f), n(this._scrollElement).off(h), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null;
      }, i._getConfig = function (t) {
        var e;
        return "string" != typeof (t = o({}, u, "object" == typeof t && t ? t : {})).target && l.isElement(t.target) && ((e = n(t.target).attr("id")) || (e = l.getUID(a), n(t.target).attr("id", e)), t.target = "#" + e), l.typeCheckConfig(a, t, g), t;
      }, i._getScrollTop = function () {
        return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
      }, i._getScrollHeight = function () {
        return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      }, i._getOffsetHeight = function () {
        return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
      }, i._process = function () {
        var t = this._getScrollTop() + this._config.offset, e = this._getScrollHeight(), r = this._config.offset + e - this._getOffsetHeight();
        if (this._scrollHeight !== e && this.refresh(), r <= t) {
          var s = this._targets[this._targets.length - 1];
          this._activeTarget !== s && this._activate(s);
        } else {
          if (this._activeTarget && t < this._offsets[0] && 0 < this._offsets[0]) return this._activeTarget = null, void this._clear();
          for (var i = this._offsets.length; i--;) {
            this._activeTarget !== this._targets[i] && t >= this._offsets[i] && (void 0 === this._offsets[i + 1] || t < this._offsets[i + 1]) && this._activate(this._targets[i]);
          }
        }
      }, i._activate = function (e) {
        this._activeTarget = e, this._clear();
        var t = this._selector.split(",").map(function (t) {
          return t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]';
        }), r = n([].slice.call(document.querySelectorAll(t.join(","))));
        r.hasClass("dropdown-item") ? (r.closest(".dropdown").find(".dropdown-toggle").addClass(_), r.addClass(_)) : (r.addClass(_), r.parents(d).prev(p + ", " + m).addClass(_), r.parents(d).prev(".nav-item").children(p).addClass(_)), n(this._scrollElement).trigger("activate.bs.scrollspy", {relatedTarget: e});
      }, i._clear = function () {
        [].slice.call(document.querySelectorAll(this._selector)).filter(function (t) {
          return t.classList.contains(_);
        }).forEach(function (t) {
          return t.classList.remove(_);
        });
      }, r._jQueryInterface = function (e) {
        return this.each(function () {
          var t = n(this).data(f);
          if (t || (t = new r(this, "object" == typeof e && e), n(this).data(f, t)), "string" == typeof e) {
            if (void 0 === t[e]) throw new TypeError('No method named "' + e + '"');
            t[e]();
          }
        });
      }, t = r, s = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}, {key: "Default", get: function () {
        return u;
      }}], (e = null) && c(t.prototype, e), s && c(t, s), r;
    }();
    return n(window).on("load.bs.scrollspy.data-api", function () {
      for (var t = [].slice.call(document.querySelectorAll('[data-spy="scroll"]')), e = t.length; e--;) {
        var r = n(t[e]);
        s._jQueryInterface.call(r, r.data());
      }
    }), n.fn[a] = s._jQueryInterface, n.fn[a].Constructor = s, n.fn[a].noConflict = function () {
      return n.fn[a] = t, s._jQueryInterface;
    }, s;
  });
  !function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("jquery"), require("./util.js")) : "function" == typeof define && define.amd ? define(["jquery", "./util.js"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Tab = t(e.jQuery, e.Util);
  }(this, function (d, u) {
    "use strict";
    function i(e, t) {
      for (var n = 0; n < t.length; n++) {
        var a = t[n];
        a.enumerable = a.enumerable || false, a.configurable = true, "value" in a && (a.writable = true), Object.defineProperty(e, a.key, a);
      }
    }
    d = d && Object.prototype.hasOwnProperty.call(d, "default") ? d.default : d, u = u && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
    var e = "tab", o = "bs.tab", t = d.fn[e], c = "active", s = "fade", f = "show", h = ".active", m = "> li > .active", n = function () {
      function a(e) {
        this._element = e;
      }
      var e, t, n, r = a.prototype;
      return r.show = function () {
        var e, t, n, a, r, i, o, l, s = this;
        this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && d(this._element).hasClass(c) || d(this._element).hasClass("disabled") || (t = d(this._element).closest(".nav, .list-group")[0], n = u.getSelectorFromElement(this._element), t && (a = "UL" === t.nodeName || "OL" === t.nodeName ? m : h, r = (r = d.makeArray(d(t).find(a)))[r.length - 1]), i = d.Event("hide.bs.tab", {relatedTarget: this._element}), o = d.Event("show.bs.tab", {relatedTarget: r}), r && d(r).trigger(i), d(this._element).trigger(o), o.isDefaultPrevented() || i.isDefaultPrevented() || (n && (e = document.querySelector(n)), this._activate(this._element, t), l = function () {
          var e = d.Event("hidden.bs.tab", {relatedTarget: s._element}), t = d.Event("shown.bs.tab", {relatedTarget: r});
          d(r).trigger(e), d(s._element).trigger(t);
        }, e ? this._activate(e, e.parentNode, l) : l()));
      }, r.dispose = function () {
        d.removeData(this._element, o), this._element = null;
      }, r._activate = function (e, t, n) {
        var r, i = this, o = (!t || "UL" !== t.nodeName && "OL" !== t.nodeName ? d(t).children(h) : d(t).find(m))[0], l = n && o && d(o).hasClass(s);
        o && l ? (r = u.getTransitionDurationFromElement(o), d(o).removeClass(f).one(u.TRANSITION_END, a).emulateTransitionEnd(r)) : i._transitionComplete(e, o, n);
      }, r._transitionComplete = function (e, t, n) {
        var a, r, i;
        t && (d(t).removeClass(c), (a = d(t.parentNode).find("> .dropdown-menu .active")[0]) && d(a).removeClass(c), "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", false)), d(e).addClass(c), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", true), u.reflow(e), e.classList.contains(s) && e.classList.add(f), e.parentNode && d(e.parentNode).hasClass("dropdown-menu") && ((r = d(e).closest(".dropdown")[0]) && (i = [].slice.call(r.querySelectorAll(".dropdown-toggle")), d(i).addClass(c)), e.setAttribute("aria-expanded", true)), n && n();
      }, a._jQueryInterface = function (n) {
        return this.each(function () {
          var e = d(this), t = e.data(o);
          if (t || (t = new a(this), e.data(o, t)), "string" == typeof n) {
            if (void 0 === t[n]) throw new TypeError('No method named "' + n + '"');
            t[n]();
          }
        });
      }, e = a, n = [{key: "VERSION", get: function () {
        return "4.5.2";
      }}], (t = null) && i(e.prototype, t), n && i(e, n), a;
    }();
    return d(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]', function (e) {
      e.preventDefault(), n._jQueryInterface.call(d(this), "show");
    }), d.fn[e] = n._jQueryInterface, d.fn[e].Constructor = n, d.fn[e].noConflict = function () {
      return d.fn[e] = t, n._jQueryInterface;
    }, n;
  });
} catch (e) {}
try {
  "use strict";
  var loginURL = "/game_data/login", registerURL = "/api/v1/game_data/register", verifySecurityQuestionURL = "/api/v1/game_data/verify", updatePasswordURL = "/api/v1/game_data/update_password", authAPI = {login: function (a) {
    var e = "".concat(loginURL, "?").concat(a);
    return $.ajax({url: e, method: "GET", dataType: "json"});
  }, register: function (a) {
    return $.ajax({type: "POST", url: registerURL, dataType: "json", data: a});
  }, verifySecurityQuestion: function (a) {
    return $.ajax({type: "POST", url: verifySecurityQuestionURL, dataType: "json", data: a});
  }, updatePassword: function (a, e) {
    var t = 1 < arguments.length && void 0 !== e ? e : null, r = getCookie("temp_user_token") ? getCookie("temp_user_token") : t;
    return $.ajax({type: "POST", url: updatePasswordURL, dataType: "json", data: {user_key: r, password: a}});
  }};
  "use strict";
  !function (t) {
    t(function () {
      t(".meet-characters-pic .pic").each(function (a, c) {
        var e, r = t(c).attr("id");
        -1 < r.indexOf("-") && (e = r.split("-").pop(), t("#character-hover-" + e).on("mouseenter", function () {
          t('[id^="character-"].pic').removeClass("active-character"), t('[id^="character-info-"]').removeClass("active-info"), t(c).addClass("active-character"), t("#character-info-" + e).addClass("active-info");
        }));
      });
    });
  }(jQuery);
  "use strict";
  function setCookie(e, t, o) {
    var n = new Date;
    n.setTime(n.getTime() + 24 * o * 60 * 60 * 1e3);
    var i = "expires=" + n.toUTCString();
    document.cookie = e + "=" + t + ";" + i + ";path=/";
  }
  function getCookie(e) {
    for (var t = e + "=", o = decodeURIComponent(document.cookie).split(";"), n = 0; n < o.length; n++) {
      for (var i = o[n]; " " == i.charAt(0);) i = i.substring(1);
      if (0 == i.indexOf(t)) return i.substring(t.length, i.length);
    }
    return null;
  }
  function deleteCookie(e) {
    setCookie(e, "", -1);
  }
  function getQueryParams(e) {
    e = e.split("+").join(" ");
    for (var t, o = {}, n = /[?&]?([^=]+)=([^&]*)/g; t = n.exec(e);) o[decodeURIComponent(t[1])] = decodeURIComponent(t[2]);
    return o;
  }
  "use strict";
  $(document).ready(function () {
    function d(e) {
      favouritePagesAPI.get(e).then(function (e) {
        setCookie("favouritePages", JSON.stringify(e.favourite_pages), 1);
      }).catch(function (e) {
        $(".error-save-page").text(e.responseJSON.errors);
      });
    }
    document.addEventListener("click", function (e) {
      var a, s, t, o, r, n, i = e.target;
      i.classList.contains("is-saved") && (a = i, s = $(a).data("page-id"), t = $(a).data("page-url"), favouritePagesAPI.delete(s).then(function () {
        $(a).removeClass("is-saved").addClass("save-page").html("Save"), $(".navbar-teach").find("a[href='".concat(t, "']")).removeClass("is-saved"), d(getCookie("user_token"));
      }).catch(function (e) {
        401 === e.status ? ($(".error-save-page").text(e.responseJSON.errors), d(getCookie("user_token"))) : $(".error-save-page").text("Something went wrong.");
      })), i.classList.contains("save-page") && (o = i, r = $(o).data("page-id"), n = $(o).data("page-url"), favouritePagesAPI.add(r, n).then(function () {
        $(o).removeClass("save-page").addClass("is-saved").html("Saved"), $(".navbar-teach").find("a[href='".concat(n, "']")).addClass("is-saved"), d(getCookie("user_token"));
      }).catch(function (e) {
        422 === e.status ? ($(".error-save-page").text(e.responseJSON.errors), $(o).removeClass("save-page").addClass("is-saved").html("Saved"), $(".navbar-teach").find("a[href='".concat(n, "']")).addClass("is-saved"), d(getCookie("user_token"))) : $(".error-save-page").text("Something went wrong.");
      }));
    }), !getCookie("favouritePages") || $("body").hasClass("single-teach") && JSON.parse(getCookie("favouritePages")).forEach(function (e) {
      e.page_id;
      var a = e.url;
      $(".block-teach-content").find("button[data-page-url='".concat(a, "']")).removeClass("save-page").addClass("is-saved").html("Saved"), $(".navbar-teach").find("a[href='".concat(a, "']")).addClass("is-saved");
    });
  });
  "use strict";
  var favPagesURL = "/api/v1/favourite_pages", user_key = getCookie("user_token") ? getCookie("user_token") : null, favouritePagesAPI = {get: function (e) {
    var a = 0 < arguments.length && void 0 !== e ? e : null;
    return $.ajax({url: favPagesURL, method: "GET", dataType: "json", data: {user_key: a || user_key}});
  }, add: function (e, a) {
    return $.ajax({url: "".concat(favPagesURL), method: "POST", type: "POST", dataType: "json", data: {user_key: user_key, page_id: e, url: a}});
  }, update: function (e, a) {
    return $.ajax({url: "".concat(favPagesURL, "/").concat(e), method: "PUT", dataType: "json", data: {user_key: user_key, url: a}});
  }, delete: function (e) {
    return $.ajax({url: "".concat(favPagesURL, "/").concat(e), method: "DELETE", dataType: "json", data: {user_key: user_key}});
  }};
  "use strict";
  $(document).ready(function () {
    var t = $("#reset-next-step"), a = $("#reset_pass_form"), r = $("#submit_reset_password");
    t.click(function (e) {
      e.preventDefault();
      var s = {username: $("#reset-password-username").val(), security_question: $("#reset_security_question").val(), security_question_answer: $("#reset_security_question_answer").val()};
      authAPI.verifySecurityQuestion(s).then(function (e) {
        a.find(".step-1").addClass("hide"), a.find(".step-2").addClass("hide"), t.addClass("hide"), a.find(".step-3").removeClass("hide"), r.removeClass("hide"), r.addClass("show"), a.find(".step-3").addClass("show"), a.find(".error").text(""), setCookie("temp_user_token", e.user_key, .1), setCookie("temp_user_name", e.user_name, .1);
      }).catch(function (e) {
        var s = e.responseJSON.errors.replace("<![CDATA[", "").replace("]]>", "");
        a.find(".error").text(s);
      });
    }), r.click(function (e) {
      e.preventDefault();
      var t = $("#reset-password-new").val(), s = $("#confirm_password-new").val(), r = getCookie("temp_user_token");
      0 === s.localeCompare(t) ? authAPI.updatePassword(t, r).then(function (e) {
        var s = getCookie("temp_user_name");
        window.location.href = "/thank-you-page?username=".concat(s, "&password=").concat(t, "&update=1"), deleteCookie("temp_user_name"), deleteCookie("temp_user_token");
      }).catch(function (e) {
        var s = e.responseJSON.errors.replace("<![CDATA[", "").replace("]]>", "");
        a.find(".error").text(s);
      }) : a.find(".error").text("The passwords doesn't match");
    });
  });
  "use strict";
  !function (e) {
    e(function () {
      function o() {
        "992" <= e(window).width() ? e(".navbar .dropdown-toggle[data-toggle]").attr("data-toggle", "") : e(".navbar .dropdown-toggle[data-toggle]").attr("data-toggle", "dropdown");
      }
      var n;
      e('[data-toggle="offcanvas"]').click(function () {
        e("body").toggleClass("menu-open"), e(".js-close").click(function () {
          e("body").removeClass("menu-open");
        });
      }), o(), e(window).resize(function () {
        o();
      }), e(".scroll-to").on("click", function (o) {
        var n = e(this).attr("href"), t = e(this).hasClass("nav-action-link") ? 80 : 20;
        e("html, body").animate({scrollTop: e(n).offset().top - t}, 500);
      }), e(".title-colored").html(function () {
        var o = e(this).text().trim().split(" "), n = o.shift();
        return (0 < o.length ? '<span class="text-primary">' + n + "</span> " : n) + o.join(" ");
      }), e("#printRegisteredInfo").on("click", function () {
        window.print();
      }), e(".navbar-teach .current-menu-parent .dropdown-menu").addClass("show"), e(".navbar-teach .current-teach-ancestor").addClass("show"), e(".navbar-teach .current-teach-parent").addClass("show"), e(".navbar-teach > .menu-item-has-children.dropdown").on("click", function (o) {
        e(this).hasClass("show") || (e(".dropdown").removeClass("show"), e(".dropdown-menu").removeClass("show"));
      }), e(".navbar-teach .dropdown").on("hide.bs.dropdown", function (o) {
        o.clickEvent && o.preventDefault();
      }), 0 < e(".block-teach-content .embed-wrapper").length && (pdfjsLib.GlobalWorkerOptions.workerSrc = "/wp-content/plugins/PDFEmbedder-premium/js/pdfjs/pdf-4.4.1.worker.js"), window.location.hash && ("register-form" !== (n = window.location.hash.substring(1)) && "login-form" !== n && "reset-password-form" !== n || e("#" + n).toggleClass("show"));
    });
  }(jQuery);
  "use strict";
  $(document).ready(function () {
    var e = $("#login_form"), t = $(".btn-logout-js");
    e.submit(function (e) {
      var o = this;
      e.preventDefault();
      var t = $(this).serialize();
      authAPI.login(t).then(function (e) {
        var t;
        setCookie("user_token", e.user_key, 1), setCookie("user_name", e.user_name, 1), t = e.user_key, favouritePagesAPI.get(t).then(function (e) {
          setCookie("favouritePages", JSON.stringify(e.favourite_pages), 1);
        }).catch(function (e) {
          $(".error-save-page").text("Something went wrong.");
        }), location.reload();
      }).catch(function (e) {
        var t = e.responseJSON.errors.replace("<![CDATA[", "").replace("]]>", "");
        $(o).find(".error").text(t);
      });
    }), t.click(function (e) {
      e.preventDefault(), deleteCookie("user_token"), deleteCookie("user_name"), deleteCookie("favouritePages"), location.reload();
    });
  });
  "use strict";
  !function (a) {
    a(function () {
      a(".owl-carousel-testimonials").owlCarousel({items: 1, animateIn: "noFade", dots: true, autoplay: true, autoplayTimeout: 1e4, autoplayHoverPause: true, loop: true, nav: true, navText: ["<span class='icon-angle-left'></span>", "<span class='icon-angle-right'></span>"]}).trigger("refresh.owl.carousel"), a(".owl-1").owlCarousel({nav: true, dots: false, items: 1, navContainer: ".carousel-nav", navText: ["<span class='icon-angle-left'></span>", "<span class='icon-angle-right'></span>"]});
    });
  }(jQuery);
  "use strict";
  function ownKeys(t, e) {
    var r, n = Object.keys(t);
    return Object.getOwnPropertySymbols && (r = Object.getOwnPropertySymbols(t), e && (r = r.filter(function (e) {
      return Object.getOwnPropertyDescriptor(t, e).enumerable;
    })), n.push.apply(n, r)), n;
  }
  function _objectSpread(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {};
      e % 2 ? ownKeys(Object(r), true).forEach(function (e) {
        e in t ? Object.defineProperty(t, e, {value: r[e], enumerable: true, configurable: true, writable: true}) : t[e] = r[e], t;
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : ownKeys(Object(r)).forEach(function (e) {
        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
      });
    }
    return t;
  }
  !function (n) {
    var e;
    n("#clear_register_form").click(function (e) {
      e.preventDefault(), n(this).closest("form").find("input[type=text], input[type=password], textarea").val(""), n(this).closest("form").find("input[type = radio]").prop("checked", false), n(this).closest("form").find(".dependent-field").hide();
    }), n("#register_form input[type=radio][name=type]").change(function () {
      var e = n("#dependent-grade"), t = n("#dependent-school"), r = n("#dependent-email");
      "student" === this.value ? (e.show(), t.hide(), r.hide()) : "educator" === this.value ? (e.show(), t.show(), r.show()) : "other" === this.value && (r.show(), t.hide(), e.hide());
    }), n("#register_form").submit(function () {
      var r = this;
      event.preventDefault();
      var t = n(this).serializeArray().reduce(function (e, t) {
        return _objectSpread(_objectSpread({}, e), {}, (t.name in {} ? Object.defineProperty({}, t.name, {value: t.value, enumerable: true, configurable: true, writable: true}) : {}[t.name] = t.value, {}));
      }, {});
      delete t.confirm_password, "student" === t.type ? (delete t.school_name, delete t.email) : "other" === t.type && (delete t.school_name, delete t.grade), authAPI.register(t).then(function (e) {
        setCookie("user_token", e.user_key, 1), setCookie("user_name", e.user_name, 1), window.location.href = "/thank-you-page?username=".concat(t.username, "&password=").concat(t.password);
      }).catch(function (e) {
        var t = e.responseJSON.errors.replace("<![CDATA[", "").replace("]]>", "");
        n(r).find(".error").text(t);
      });
    }), -1 < window.location.href.indexOf("thank-you-page") && (e = getQueryParams(document.location.search), n(".thank-you-page-content .username").text(e.username), n(".thank-you-page-content .password").text(e.password), (e.update ? e.update : null) && (n(".thank-you-page-content .title-md").text("Thank you!"), n(".thank-you-page-content p").eq(0).text("You account has been updated. Here is your current information:")));
  }(jQuery);
  "use strict";
  !function (i) {
    i(function () {
      var e, t, r;
      0 < i(".youtube").length && ((e = document.createElement("script")).src = "https://www.youtube.com/iframe_api", e.async = true, (t = document.getElementsByTagName("script")[0]).parentNode.insertBefore(e, t));
      for (var a = document.querySelectorAll(".ytEmbed"), o = 0; o < a.length; o++) a[o].addEventListener("click", function () {
        r = new YT.Player(this.id, {height: "", width: "", videoId: this.dataset.embed, events: {onReady: function () {
          r.playVideo();
        }}});
      });
      var n = i(".modal-trailer");
      n.on("show.bs.modal", function (e) {
        var t = i(this).find("iframe"), r = t.attr("src");
        t.prop("src", "").prop("src", r.replace("&autoplay=0", "&autoplay=1"));
      }), n.on("hidden.bs.modal", function (e) {
        var t = i(this).find("iframe"), r = t.attr("src");
        t.prop("src", "").prop("src", r.replace("&autoplay=1", "&autoplay=0"));
      });
    });
  }(jQuery);
} catch (e) {}
try {
  !function (d, l) {
    "use strict";
    var e = false, o = false;
    if (l.querySelector) if (d.addEventListener) e = true;
    if (d.wp = d.wp || {}, !d.wp.receiveEmbedMessage) if (d.wp.receiveEmbedMessage = function (e) {
      var t = e.data;
      if (t) if (t.secret || t.message || t.value) if (!/[^a-zA-Z0-9]/.test(t.secret)) {
        var r, a, i, s, n, o = l.querySelectorAll('iframe[data-secret="' + t.secret + '"]'), c = l.querySelectorAll('blockquote[data-secret="' + t.secret + '"]');
        for (r = 0; r < c.length; r++) c[r].style.display = "none";
        for (r = 0; r < o.length; r++) if (a = o[r], e.source === a.contentWindow) {
          if (a.removeAttribute("style"), "height" === t.message) {
            if (1e3 < (i = parseInt(t.value, 10))) i = 1e3; else if (~~i < 200) i = 200;
            a.height = i;
          }
          if ("link" === t.message) if (s = l.createElement("a"), n = l.createElement("a"), s.href = a.getAttribute("src"), n.href = t.value, n.host === s.host) if (l.activeElement === a) d.top.location.href = t.value;
        }
      }
    }, e) d.addEventListener("message", d.wp.receiveEmbedMessage, false), l.addEventListener("DOMContentLoaded", t, false), d.addEventListener("load", t, false);
    function t() {
      if (!o) {
        o = true;
        var e, t, r, a, i = -1 !== navigator.appVersion.indexOf("MSIE 10"), s = !!navigator.userAgent.match(/Trident.*rv:11\./), n = l.querySelectorAll("iframe.wp-embedded-content");
        for (t = 0; t < n.length; t++) {
          if (!(r = n[t]).getAttribute("data-secret")) a = Math.random().toString(36).substr(2, 10), r.src += "#?secret=" + a, r.setAttribute("data-secret", a);
          if (i || s) (e = r.cloneNode(true)).removeAttribute("security"), r.parentNode.replaceChild(e, r);
        }
      }
    }
  }(window, document);
} catch (e) {}
