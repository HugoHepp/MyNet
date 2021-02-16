<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Client;
use App\Entity\Invoice;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $auth)
    {
        $this->security = $security;
        $this->auth = $auth;
    }

    private function addWhere(Querybuilder $queryBuilder, string $resourceClass)
    {
     
        $user = $this->security->getUser();

        if($resourceClass === Client::class || $resourceClass === Invoice::class && (!$this->auth->isGranted('ROLE_ADMIN')) && $user instanceof User)
        {
            $rootAlias = $queryBuilder->getRootAliases()[0];
            if($resourceClass === Client::class){

                $queryBuilder->andWhere("$rootAlias.user = :user");

            } else if ($resourceClass === Invoice::class)
            {
                $queryBuilder->join("$rootAlias.client", "c")
                             ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);

        }

    }


    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        if ($this->security->getUser() instanceof User){ // boucle a supprimer apres developpement
       $this->addWhere($queryBuilder, $resourceClass);
        }
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        if ($this->security->getUser() instanceof User){ // boucle a supprimer apres developpement 
            $this->addWhere($queryBuilder, $resourceClass);
        }
    }
}