<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Client;
use App\Entity\Invoice;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    protected $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        // Creation of faker object to create fake data
        $faker = Factory::create('fr_FR');   
        // $manager->persist($product);

        // Create user loop
        for ($c = 0; $c < 10; $c++)
        {
            $user = new User;
            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName)
                 ->setEmail("user".$c."@example.com")
                 ->setPassword($this->passwordEncoder->encodePassword($user,'password'));
            $manager->persist($user);


            for ($i = 0; $i < 5; $i++)
            {
                $client = new Client;
                $client->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setCompany($faker->company)
                    ->setUser($user);
                $manager->persist($client);
    
    
                    for ($j = 0; $j < mt_rand(0,5); $j++)
                    {
                        $invoice = new Invoice;
                        $invoice->setAmount(mt_rand(5000,10000))
                                ->setStatus($faker->randomElement(array('PAID','WAIT', 'CANCELLED')))
                                ->setSentAt($faker->dateTimeBetween('-6 months'))
                                ->setClient($client);
            
                        $manager->persist($invoice);
                    }
            }
        }

    

        $manager->flush();
    }
}
