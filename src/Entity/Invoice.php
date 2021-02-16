<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *  attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=20,
 *      "order": {"amount":"desc"}*          
 *      },
 *  normalizationContext={
 *      "groups" = {"invoices_read"}
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={"status":"partial", "client.firstName": "partial"})
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","client_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","client_read"})
     */
    private $amount;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read","client_read"})
     */
    private $status;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read","client_read"})
     */
    private $sentAt;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     */
    private $client;


    /**
     * Return the user owner of the invoice
     * @Groups({"invoices_read"})
     * @return User
     */
    public function getUser(): User {
        return $this->client->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?int
    {
        return $this->amount;
    }

    public function setAmount(int $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }
}
