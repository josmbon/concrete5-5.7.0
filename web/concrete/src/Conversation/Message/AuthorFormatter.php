<?php
namespace Concrete\Core\Conversation\Message;

use Concrete\Core\User\UserInfo;

class AuthorFormatter
{

    protected $author;

    public function __construct(Author $author)
    {
        $this->author = $author;
    }

    /**
     * @return string
     */
    public function getDisplayName()
    {
        $ui = $this->author->getUser();
        if (is_object($ui)) {
            return $ui->getUserDisplayName();
        } else if ($this->author->getName()) {
            return $this->author->getName();
        } else {
            return t('Anonymous');
        }
    }

    /**
     * @return string
     */
    public function getLinkedAdministrativeDisplayName()
    {
        $ui = $this->author->getUser();
        $html = '<a href="%s">%s</a>';
        if (is_object($ui)) {
            $link = \URL::to('/dashboard/users/search', 'view', $ui->getUserID());
            $name = $ui->getUserDisplayName();
        } else if ($this->author->getName()) {
            $link = 'mailto:' . $this->author->getEmail();
            $name = $this->author->getName();
        } else {
            return t('Anonymous');
        }
        return sprintf($html, $link, $name);
    }
}