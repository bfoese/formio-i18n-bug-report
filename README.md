# Form.io i18n Bug Report

This demo application demonstrates inconsistencies concerning i18n handling for the form rendering components.

I would expect that the translations I provide for the builder are handled independently from the translations I provide for the rendered form. Instead, the translations provided for the builder are being applied to the rendered form, depending on how you initialized the `FormBuilderOptions`. It seems as if in this case, `<formio>` uses the same `i18next` instance as `<form-builder>`, which should be prevented.
In order to prevent the translations from the Builder to bleed through the rendered form, you either need to provide the correct `language` in `FormBuilderOptions` upfront (eager) or in case you can only lazy load the language, you must assign a new `i18next` instance to the form render component manually.

The second inconsistency is, that the form preview that is contained within native `<form-builder>`, is always affected by the translations that are dedicated for the form builder. Therefore the form preview within `<form-builder>` does not provide the same preview (concerning i18n) that you get, when rendering the same form JSON with `<formio>` component.

## Run the demo

Install and start the application:

```
yarn install
yarn start
```

The application will automatically open within a new browser tab under `http://localhost:4205`.

## Screenshots

![Builder vs Form Renderer](https://github.com/bfoese/formio-i18n-bug-report/blob/8faa0b402789bd74586b606c2c98c2e8074fe3f8/screenshot.png)
