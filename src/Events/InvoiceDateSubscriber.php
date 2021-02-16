<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceDateSubscriber implements EventSubscriberInterface
{

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setDateForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    function setDateForInvoice(ViewEvent $event)
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && $method === "POST")
        {
            if(empty($invoice->getSentAt()))
            {
                $invoice->setSentAt(new DateTime());
            }
        }
    }
}