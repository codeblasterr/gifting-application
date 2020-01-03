import React, { useContext, useEffect, useState, useMemo } from "react";
import { Formik, Field, Form, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";

import {
  createGift,
  getValidationCls,
  getGiftById,
  getSearchParams,
  updateGift
} from "./../../utilities/utils";
import { AppDispatchContext, AppStateContext } from "./../../../../App";
import { RESPONSE_MODAL_OPEN } from "./../../utilities/AppReducer";

import "./AddGiftCard.css";

const AddGiftCard = () => {
  const [giftCard, setGiftCard] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const appDispatchContext = useContext(AppDispatchContext);
  const appStateContext = useContext(AppStateContext);
  const categories = appStateContext.categories;
  const prams = getSearchParams();
  const { productId } = prams;
  const defaultSelection = categories[0].id;
  const dropDownInput = useMemo(
    categories.map((category, index) => {
      return (
        <option key={category.id} value={category.id} selected={index === 0}>
          {category.name}
        </option>
      );
    }),
    [categories]
  );

  useEffect(() => {
    (async () => {
      if (productId) {
        setIsUpdate(true);
        appDispatchContext.showSpinner();
        const product = await getGiftById(productId);
        if (product && product.id) {
          setGiftCard(product);
        }
        appDispatchContext.hideSpinner();
      }
    })();
  }, [productId]);
  return (
    <div className="cls_addGiftCont">
      <h3>{isUpdate ? "Edit" : "Add"} Gift Card</h3>
      <Formik
        initialValues={{
          name: giftCard.name || "",
          brand: giftCard.brand || "",
          desc: giftCard.desc || "",
          imageUrl: giftCard.imageUrl || "",
          buyoutPoints: giftCard.buyoutPoints || "",
          discount: giftCard.discount || "",
          categoryId: giftCard.categoryId || defaultSelection,
          id: giftCard.id || ""
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("*Required"),
          brand: Yup.string().required("*Required"),
          desc: Yup.string().required("*Required"),
          imageUrl: Yup.string()
            .url("Please provide valid image URL")
            .required("*Required"),
          buyoutPoints: Yup.number().required("*Required"),
          discount: Yup.number().required("*Required"),
          categoryId: Yup.number().required("*Required"),
          id: Yup.string("Id accepts only Alpha numeric.").required("*Required")
        })}
        onSubmit={async (values, { setSubmitting }) => {
          let response = null;
          appDispatchContext.showSpinner();
          const {
            name,
            brand,
            desc,
            imageUrl,
            buyoutPoints,
            discount,
            categoryId,
            id
          } = values;
          const data = {
            name,
            brand,
            desc,
            imageUrl,
            buyoutPoints,
            discount,
            categoryId,
            rating: "",
            id
          };
          if (!isUpdate) {
            response = await createGift(data);
          } else {
            response = await updateGift(id, data);
          }
          if (response.id) {
            appDispatchContext.dispatch({
              type: RESPONSE_MODAL_OPEN,
              payLoad: {
                isOpen: true,
                message: `Your Gift Card has ${
                  isUpdate ? "updated" : "created"
                } successfully.`
              }
            });
          }
          appDispatchContext.hideSpinner();
          setSubmitting(false);
        }}
        enableReinitialize={true}
      >
        {formProps => (
          <Form>
            <div className="cls_inputElemCont">
              <div className="cls_inputElem">
                <label htmlFor="id">ID</label>
                <Field
                  className={getValidationCls(formProps.errors, "id", getIn)}
                  name="id"
                  type="text"
                />
                <ErrorMessage name="id">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="name">Name</label>
                <Field
                  className={getValidationCls(formProps.errors, "name", getIn)}
                  name="name"
                  type="text"
                />
                <ErrorMessage name="name">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="brand">Brand</label>
                <Field
                  className={getValidationCls(formProps.errors, "brand", getIn)}
                  name="brand"
                  type="text"
                />
                <ErrorMessage name="brand">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="desc">Description:</label>
                <Field
                  className={getValidationCls(formProps.errors, "desc", getIn)}
                  name="desc"
                  type="text"
                />
                <ErrorMessage name="desc">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="imageUrl">Image URL</label>
                <Field
                  className={getValidationCls(
                    formProps.errors,
                    "imageUrl",
                    getIn
                  )}
                  name="imageUrl"
                  type="text"
                />
                <ErrorMessage name="imageUrl">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="buyoutPoints">Buy out points</label>
                <Field
                  className={getValidationCls(
                    formProps.errors,
                    "buyoutPoints",
                    getIn
                  )}
                  name="buyoutPoints"
                  type="text"
                />
                <ErrorMessage name="buyoutPoints">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="discount">Discount</label>
                <Field
                  className={getValidationCls(
                    formProps.errors,
                    "discount",
                    getIn
                  )}
                  name="discount"
                  type="text"
                />
                <ErrorMessage name="discount">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
              <div className="cls_inputElem">
                <label htmlFor="categoryId">Category</label>
                <Field
                  className={getValidationCls(
                    formProps.errors,
                    "categoryId",
                    getIn
                  )}
                  name="categoryId"
                  as="select"
                  value={defaultSelection}
                >
                  {dropDownInput}
                </Field>
                <ErrorMessage name="categoryId">
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>
            <div className="cls_buttonCont">
              <button
                className="btn"
                type="submit"
                name={isUpdate ? "Update Gift button" : "Add Gift button"}
              >
                {isUpdate ? "Update Gift" : "Add Gift"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(AddGiftCard);
