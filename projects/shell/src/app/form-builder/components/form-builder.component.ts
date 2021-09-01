import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import i18next from 'i18next';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  FormioFormBuilderEvent,
  FormioFormBuilderOptions,
  FormioFormBuilderTabOptions
} from '../../types/formio/formio.types';
import { FormBuilderOptionsService } from '../services/form-builder-options.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit, OnDestroy {
  private _jsonFormPreviewElement: ElementRef<HTMLElement>;

  @ViewChild('appJsonFormPreview', { static: false })
  private set jsonFormPreviewElement(jsonFormPreviewElement: ElementRef<HTMLElement>) {
    this._jsonFormPreviewElement = jsonFormPreviewElement;
    this.updatePreviewForm(this.form);
  }

  @Input()
  public lazyLoadFormBuilderLanguage: boolean;

  private readonly _subscriptions = new Subscription();

  public readonly triggerRefreshForm = new EventEmitter();

  public formBuilderOptions;

  private readonly showJsonPreview$ = new BehaviorSubject<boolean>(false);

  public constructor(private formBuilderOptionsService: FormBuilderOptionsService) {}

  public readonly rebuildEmitter = new Subject<FormioFormBuilderOptions>();

  public readonly form = this.createExampleForm();

  public formRenderOptions = {
    i18next: i18next.createInstance()
  };

  public readonly formOptions = {
    i18n: {
      de: {
        Placeholder: '[i18n from Form] Platzhalter 2',
        Description: '[i18n from Form] Beschreibung 2'
      }
    }
  };

  public ngOnInit(): void {
    this.formBuilderOptions = this.getFormBuilderOptions(this.lazyLoadFormBuilderLanguage);

    this._subscriptions.add(
      this.showJsonPreview$
        .pipe(filter((showJsonPreview) => showJsonPreview === true))
        .subscribe(() => this.updatePreviewForm(this.form))
    );

    this._subscriptions.add(
      this.formBuilderOptionsService.getI18nOptions().subscribe((i18nOptions) => {
        this.formBuilderOptions.language = i18nOptions?.language;
        this.formBuilderOptions.i18n = i18nOptions?.i18n;
        this.rebuildEmitter.next(this.formBuilderOptions);
      })
    );
  }

  public ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public toggleJsonPreview(show: boolean): void {
    this.showJsonPreview$.next(show);
  }
  public onFormBuilderChange(event: FormioFormBuilderEvent): void {
    this.updatePreviewForm(event.form);
  }

  private updatePreviewForm(form: unknown) {
    if (this._jsonFormPreviewElement) {
      this._jsonFormPreviewElement.nativeElement.innerHTML = '';
      this._jsonFormPreviewElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(form, null, 4)));
    }

    this.triggerRefreshForm.emit({
      property: 'form',
      value: this.form
    });
  }

  private createExampleForm(): any {
    return {
      components: [
        {
          label: 'Placeholder',
          labelPosition: 'top',
          placeholder: '',
          description: 'Description',
          tooltip: '',
          widget: {
            type: 'input'
          },
          inputMask: '',
          allowMultipleMasks: false,
          customClass: '',
          tabindex: '',
          autocomplete: '',
          hideLabel: false,
          showWordCount: false,
          showCharCount: false,
          mask: false,
          autofocus: false,
          spellcheck: true,
          disabled: false,
          tableView: true,
          modalEdit: false,
          firstname: '',
          listnames: '',
          type: 'textfield',
          input: true,
          key: 'textField',
          prefix: '',
          suffix: '',
          multiple: false,
          defaultValue: null,
          protected: false,
          unique: false,
          persistent: true,
          hidden: false,
          clearOnHide: true,
          refreshOn: '',
          redrawOn: '',
          dataGridLabel: false,
          errorLabel: '',
          dbIndex: false,
          customDefaultValue: '',
          calculateValue: '',
          calculateServer: false,
          attributes: {},
          validateOn: 'change',
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
            strictDateValidation: false,
            multiple: false,
            unique: false,
            minLength: '',
            maxLength: '',
            pattern: ''
          },
          conditional: {
            show: null,
            when: null,
            eq: ''
          },
          overlay: {
            style: '',
            left: '',
            top: '',
            width: '',
            height: ''
          },
          allowCalculateOverride: false,
          encrypted: false,
          properties: {},
          inputType: 'text',
          inputFormat: 'plain',
          id: 'e5bc4wg'
        }
      ]
    };
  }

  private getFormBuilderOptions(lazyLoadFormBuilderLanguage: boolean): any {
    const languageOptions = lazyLoadFormBuilderLanguage ? {} : { language: 'de' };

    return Object.assign(languageOptions, {
      builder: {
        premium: false,
        advanced: false,
        data: false,
        layout: false,

        basic: {
          default: true,
          weight: 1,
          components: {
            textfield: true,
            textarea: false,
            number: false,
            password: false,
            checkbox: false,
            select: false,
            radio: false,
            button: false,
            selectboxes: false
          }
        }
      },
      editForm: {
        textfield: <FormioFormBuilderTabOptions[]>[
          {
            key: 'data',
            ignore: true
          },
          {
            key: 'validation',
            ignore: true
          },
          {
            key: 'api',
            ignore: true
          },
          {
            key: 'conditional',
            ignore: true
          },
          {
            key: 'logic',
            ignore: true
          },
          {
            key: 'layout',
            ignore: true
          }
        ]
      }
    });
  }
}
