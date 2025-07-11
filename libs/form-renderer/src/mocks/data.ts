import type { Form } from '../types'

export const form: Form = {
  id: 5,
  title: 'Nieuwe',
  display: 'wizard',
  created_at: '2024-10-14T07:20:13.310056',
  updated_at: '2024-10-14T08:30:27.588053',
  classification: 1,
  components: [
    {
      label: 'Page 1',
      key: 'page1',
      type: 'panel',
      input: false,
      position: 1,
      components: [
        {
          label: 'Text Field 1',
          description: '',
          key: 'textField1',
          type: 'textfield',
          input: true,
          position: 1,
          validate: {
            json: null,
            required: true,
          },
          question: 79,
        },
        {
          label: 'Text Area 1',
          description: '',
          key: 'textArea1',
          type: 'textarea',
          input: true,
          position: 2,
          validate: {
            json: null,
            required: true,
          },
          autoExpand: false,
          maxCharCount: 100,
          question: 80,
        },
        {
          label: 'Select Boxes 1',
          description: '',
          key: 'selectBoxes',
          type: 'selectboxes',
          input: true,
          position: 3,
          validate: {
            json: null,
            required: true,
          },
          values: [
            {
              label: 'One',
              value: 'one',
              position: 1,
            },
            {
              label: 'Two',
              value: 'two',
              position: 2,
            },
          ],
          question: 81,
        },
        {
          label: 'Select 1',
          description: '',
          key: 'select',
          type: 'select',
          input: true,
          position: 4,
          validate: {
            json: null,
            required: true,
          },
          widget: 'html5',
          placeholder: '',
          data: {
            values: [
              {
                label: 'One',
                value: 'one',
                position: 1,
              },
              {
                label: 'Two',
                value: 'two',
                position: 2,
              },
            ],
          },
          question: 82,
        },
        {
          label: 'Radio 1',
          description: '',
          key: 'radio',
          type: 'radio',
          input: true,
          position: 5,
          validate: {
            json: null,
            required: true,
          },
          values: [
            {
              label: 'One',
              value: 'one',
              position: 1,
            },
            {
              label: 'Two',
              value: 'two',
              position: 2,
            },
          ],
          question: 83,
        },
      ],
    },
    {
      label: 'Page 3',
      key: 'page3',
      type: 'panel',
      input: false,
      position: 3,
      components: [
        {
          label: 'Text Field 2',
          description: 'Description',
          key: 'textField3',
          type: 'textfield',
          input: true,
          position: 1,
          validate: {
            json: null,
            required: false,
          },
          question: 85,
        },
        {
          label: 'Text Area 2',
          description: 'Description',
          key: 'textArea2',
          type: 'textarea',
          input: true,
          position: 2,
          validate: {
            json: null,
            required: false,
          },
          autoExpand: true,
          maxCharCount: null,
          question: 86,
        },
        {
          label: 'Select Boxes 2',
          description: 'Description',
          key: 'selectBoxes1',
          type: 'selectboxes',
          input: true,
          position: 3,
          validate: {
            json: null,
            required: false,
          },
          values: [
            {
              label: 'One',
              value: 'one',
              position: 1,
            },
            {
              label: 'Two',
              value: 'two',
              position: 2,
            },
          ],
          question: 87,
        },
        {
          label: 'Select 2',
          description: 'Description',
          key: 'select1',
          type: 'select',
          input: true,
          position: 4,
          validate: {
            json: null,
            required: false,
          },
          widget: 'html5',
          placeholder: 'Placeholder',
          data: {
            values: [
              {
                label: 'One',
                value: 'one',
                position: 1,
              },
              {
                label: 'Two',
                value: 'two',
                position: 2,
              },
            ],
          },
          question: 88,
        },
        {
          label: 'Radio 2',
          description: 'Description',
          key: 'radio1',
          type: 'radio',
          input: true,
          position: 5,
          validate: {
            json: null,
            required: false,
          },
          values: [
            {
              label: 'One',
              value: 'one',
              position: 1,
            },
            {
              label: 'Two',
              value: 'two',
              position: 2,
            },
          ],
          question: 89,
        },
      ],
    },
  ],
}
