<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerNotification;
use Inertia\Inertia;

class CustomerNotificationController extends Controller
{
    /**
     * Display all notifications for the customer identified by token.
     */
    public function index(string $token)
    {
        $customer = Customer::where('notification_token', $token)->firstOrFail();

        $notifications = $customer->notifications()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (CustomerNotification $n) => [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'read_at' => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at->toIso8601String(),
                'order_number' => $n->order?->order_number,
                'credential_count' => count($n->payload['credentials'] ?? []),
            ]);

        return Inertia::render('CustomerNotifications', [
            'customer_email' => $customer->email,
            'notification_token' => $token,
            'notifications' => $notifications,
            'unread_count' => $customer->notifications()->unread()->count(),
        ]);
    }

    /**
     * Show a single notification with full credential details + auto mark as read.
     */
    public function show(string $token, int $id)
    {
        $customer = Customer::where('notification_token', $token)->firstOrFail();

        $notification = CustomerNotification::where('customer_id', $customer->id)
            ->findOrFail($id);

        // Auto mark as read.
        if (! $notification->read_at) {
            $notification->update(['read_at' => now()]);
        }

        return Inertia::render('CustomerNotificationDetail', [
            'customer_email' => $customer->email,
            'notification_token' => $token,
            'notification' => [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'payload' => $notification->payload,
                'read_at' => $notification->read_at?->toIso8601String(),
                'created_at' => $notification->created_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Mark a notification as read (POST endpoint).
     */
    public function markAsRead(string $token, int $id)
    {
        $customer = Customer::where('notification_token', $token)->firstOrFail();

        $notification = CustomerNotification::where('customer_id', $customer->id)
            ->findOrFail($id);

        $notification->update(['read_at' => now()]);

        return back();
    }
}
