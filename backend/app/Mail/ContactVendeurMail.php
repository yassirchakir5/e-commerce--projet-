<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactVendeurMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Nouveau message : ' . $this->data['sujet'])
                    ->replyTo($this->data['email'], $this->data['nom'])
                    ->html("
                        <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                            <h2 style='color: #2563eb;'>Nouveau message depuis votre profil</h2>
                            <p><strong>De :</strong> {$this->data['nom']} ({$this->data['email']})</p>
                            <p><strong>Sujet :</strong> {$this->data['sujet']}</p>
                            <hr style='border: none; border-top: 1px solid #eee; margin: 15px 0;' />
                            <p><strong>Message :</strong></p>
                            <p style='background: #f8fafc; padding: 12px; border-radius: 6px;'>{$this->data['description']}</p>
                        </div>
                    ");
    }
}