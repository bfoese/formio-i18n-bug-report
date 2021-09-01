# Form.io i18n Bug Report

This demo application demonstrates two inconsistencies concerning i18n handling in `<formio>` component.

I would expect that the translations I provide for the builder are handled independently from the translations I provide for the rendered form. Instead, the translations provided for the builder are being applied to the rendered form, depending on how you initialized the `FormBuilderOptions`. It seems as if in this case, `<formio>` uses the same `i18next` instance as `<form-builder>`, which should be prevented.

In order to prevent the translations from the Builder to bleed through the rendered form, you either need to provide the correct `language` in `FormBuilderOptions` upfront (eager) or in case you can only lazy load the language, you must assign a new `i18next` instance to the form render component manually. 

The second inconsistency is, that the form preview that is contained within native `<form-builder>` is always affected by the translations that are dedicated for the form builder. So the form preview within `<form-builder>` does not really reflect what `<formio>` would render.

## Run the demo

Install and start the application:

```
yarn install
yarn start
```

The application will automatically open within a new browser tab under `http://localhost:4205`.

