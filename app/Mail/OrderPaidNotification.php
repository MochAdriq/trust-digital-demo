<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderPaidNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public array $credentials,
        public string $notificationToken,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pembayaran Berhasil - '.$this->order->order_number.' - TrustDigital.ID',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order-paid',
            with: [
                'order' => $this->order,
                'credentials' => $this->credentials,
                'notificationToken' => $this->notificationToken,
            ],
        );
    }
}
