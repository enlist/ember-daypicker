import Component from "@ember/component"
import { get, computed } from "@ember/object"
import { run } from "@ember/runloop"
import { isEmpty } from "@ember/utils"
import { assert } from "@ember/debug"

import moment from "moment"

import DocumentEvent from "ember-daypicker/mixins/document-event"
import isOutsideClick from "ember-daypicker/utils/is-outside-click"

export default Component.extend(DocumentEvent, {
  classNames: ["en-day-picker-wrapper"],
  documentEvents: ["click"],

  uid: computed(function() {
    return `el-${this.element.id}`
  }),

  onDocumentClick(e) {
    if (isOutsideClick(this.element, e.target)) {
      this.set("isFocused", false)
    }
  },

  isFocused: false,
  format: "MMM D",

  dateFormatted: computed("date", function() {
    let date = get(this, "date")

    if (isEmpty(date)) {
      return moment()
    } else if (!moment.isMoment(date) || !date.isValid()) {
      assert(`[ember-day] You need to pass in a valid moment object.
You passed in ${date}, which is invalid, so we're defaulting to today's date`)
      return moment()
    } else {
      return date
    }
  }),

  actions: {
    focus() {
      run(() => {
        this.set("isFocused", true)
        this.attrs["on-focus"]
      })
    },

    didSelect(date) {
      run(() => {
        this.set("isFocused", false)
        this.attrs["on-select"](date)
      })
    }
  }
})
