<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RedeemVoucherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code'            => ['required', 'string', 'min:1', 'max:20'],
            'shopee_order_id' => ['required', 'string', 'min:1', 'max:100'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.required'            => 'Kode voucher wajib diisi.',
            'code.min'                 => 'Kode voucher tidak valid.',
            'shopee_order_id.required' => 'Shopee Order ID wajib diisi.',
            'shopee_order_id.min'      => 'Shopee Order ID tidak valid.',
        ];
    }
}
