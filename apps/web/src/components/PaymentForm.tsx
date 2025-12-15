import { CreditCardOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Card, Form, Input, Radio } from "antd";

interface PaymentFormProps {
  form: FormInstance;
}

export function PaymentForm({ form }: PaymentFormProps) {
  return (
    <div>
      {/* @ts-expect-error -- antd Card type mismatch */}
      <Card title='Payment Details' className='mt-8'>
        <Form.Item name='paymentMethod' initialValue='CARD' className='mb-6'>
          <Radio.Group>
            <Radio value='CARD'>
              <div className='flex items-center gap-2'>
                <CreditCardOutlined /> Credit/Debit Card
              </div>
            </Radio>
            <Radio value='COD' disabled>
              Cash on Delivery (Disabled)
            </Radio>
          </Radio.Group>
        </Form.Item>

        <div className='grid grid-cols-1 gap-4'>
          <Form.Item
            name='cardNumber'
            label='Card Number'
            rules={[
              { required: true, message: "Please enter card number" },
              { len: 16, message: "Card number must be 16 digits" },
              { pattern: /^\d+$/, message: "Must be digits only" },
            ]}
          >
            <Input placeholder='1234 5678 1234 5678' maxLength={16} />
          </Form.Item>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              name='expiry'
              label='Expiry Date'
              rules={[
                { required: true, message: "Required" },
                { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "MM/YY format" },
              ]}
            >
              <Input placeholder='MM/YY' maxLength={5} />
            </Form.Item>

            <Form.Item
              name='cvc'
              label='CVC'
              rules={[
                { required: true, message: "Required" },
                { len: 3, message: "3 digits" },
                { pattern: /^\d+$/, message: "Digits only" },
              ]}
            >
              <Input.Password placeholder='123' maxLength={3} visibilityToggle={false} />
            </Form.Item>
          </div>

          <Form.Item
            name='cardName'
            label='Cardholder Name'
            rules={[{ required: true, message: "Please enter cardholder name" }]}
          >
            <Input placeholder='John Doe' />
          </Form.Item>
        </div>
      </Card>
    </div>
  );
}
