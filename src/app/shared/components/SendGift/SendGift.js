import React, { useContext, useCallback } from "react";
import emailjs from "emailjs-com";
import { Formik, Field, Form, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";

import { AppDispatchContext } from "./../../../../App";
import { RESPONSE_MODAL_OPEN } from "./../../utilities/AppReducer";
import {
  sendGift,
  getValidationCls,
  emailJS_userId
} from "./../../utilities/utils";

import "./SendGift.css";

const SendGift = props => {
  const appDispatchContext = useContext(AppDispatchContext);
  const sendMail = useCallback((templateId, variables) => {
    emailjs
      .send("gmail", templateId, variables, emailJS_userId)
      .then(res => {
        console.log("Email successfully sent!");
      })
      .catch(err =>
        props.responseDispatcher({
          type: RESPONSE_MODAL_OPEN,
          payLoad: {
            isOpen: true,
            message:
              "Oh well, you failed. Here some thoughts on the error that occured:"
          }
        })
      );
  }, []);
  const doSendGift = useCallback(async values => {
    const { receiverEmail, message } = values;
    const data = {
      senderId: props.userInfo.id,
      senderEmail: props.userInfo.email,
      receiverEmail,
      giftId: props.giftInfo.id,
      giftName: props.giftInfo.name,
      message,
      redemed: false
    };
    const response = await sendGift(data);

    if (response.id) {
      let emailConfig = {
        receiver: receiverEmail,
        gift_name: props.giftInfo.name,
        name: props.userInfo.name,
        link: window.location.origin,
        site_name: "YOYO Gifts"
      };
      props.doClose();
      sendMail("sendgift", emailConfig);
      props.responseDispatcher({
        type: RESPONSE_MODAL_OPEN,
        payLoad: {
          isOpen: true,
          message: "Your gift has been sent."
        }
      });
    }
  }, []);
  return (
    <>
      <div className="cls_skPopupTitle">Send Gift</div>
      <Formik
        initialValues={{
          receiverEmail: "",
          message: ""
        }}
        validationSchema={Yup.object({
          receiverEmail: Yup.string()
            .email()
            .required("*Required"),
          message: Yup.string()
        })}
        onSubmit={async (values, { setSubmitting }) => {
          appDispatchContext.showSpinner();
          await doSendGift(values);
          appDispatchContext.hideSpinner();
          setSubmitting(false);
        }}
        enableReinitialize={true}
      >
        {formProps => (
          <Form>
            <div className="cls_inputElemCont">
              <div className="cls_inputElem">
                <label htmlFor="receiverEmail">Receiver Mail:</label>
                <Field
                  className={getValidationCls(
                    formProps.errors,
                    "receiverEmail",
                    getIn
                  )}
                  name="receiverEmail"
                  type="email"
                />
                <ErrorMessage name="receiverEmail">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="message">Message:</label>
                <Field
                  className={getValidationCls(
                    formProps.errors,
                    "message",
                    getIn
                  )}
                  name="message"
                  type="textarea"
                  rows="4"
                />
                <ErrorMessage name="message">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="cls_buttonCont">
              <button className="btn" type="submit" name="Send gift">
                Send
              </button>
              <button
                className="btn"
                onClick={props.doClose}
                type="button"
                name="Cancel"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default React.memo(SendGift);
