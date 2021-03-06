<?php
namespace Concrete\Core\Updater\Migrations\Migrations;

use Concrete\Core\Permission\Access\Entity\Type;
use Concrete\Core\Permission\Category;
use Concrete\Core\Permission\Duration;
use Concrete\Core\Permission\Key\Key;
use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

class Version5732 extends AbstractMigration
{
    private $updateSectionPlurals = false;
    private $updateMultilingualTranslations = false;

    public function getName()
    {
        return '20150206000000';
    }

    public function up(Schema $schema)
    {
        $db = \Database::get();
        $db->Execute('DROP TABLE IF EXISTS PageStatistics');

        $pkx = Category::getByHandle('multilingual_section');
        if (!is_object($pkx)) {
            $pkx = Category::add('multilingual_section');
        }
        $pkx->associateAccessEntityType(Type::getByHandle('group'));
        $pkx->associateAccessEntityType(Type::getByHandle('user'));
        $pkx->associateAccessEntityType(Type::getByHandle('group_combination'));

        $db->Execute("alter table QueueMessages modify column body longtext not null");

        $ms = $schema->getTable('MultilingualSections');
        if (!$ms->hasColumn('msNumPlurals')) {
            $ms->addColumn('msNumPlurals', 'integer', array('notnull' => true, 'unsigned' => true, 'default' => 2));
            $this->updateSectionPlurals = true;
        }
        if (!$ms->hasColumn('msPluralRule')) {
            $ms->addColumn('msPluralRule', 'string', array('notnull' => true, 'length' => 255, 'default' => '(n != 1)'));
            $this->updateSectionPlurals = true;
        }
        $mt = $schema->getTable('MultilingualTranslations');
        if (!$mt->hasColumn('msgidPlural')) {
            $mt->addColumn('msgidPlural', 'text', array('notnull' => false));
            $this->updateMultilingualTranslations = true;
        }
        if (!$mt->hasColumn('msgstrPlurals')) {
            $mt->addColumn('msgstrPlurals', 'text', array('notnull' => false));
            $this->updateMultilingualTranslations = true;
        }

        $cms = $schema->getTable('ConversationMessages');
        if (!$cms->hasColumn('cnvMessageAuthorName')) {
            $cms->addColumn('cnvMessageAuthorName', 'string', array('notnull' => false, 'length' => 255));
        }
        if (!$cms->hasColumn('cnvMessageAuthorEmail')) {
            $cms->addColumn('cnvMessageAuthorEmail', 'string', array('notnull' => false, 'length' => 255));
        }

        $mss = $schema->getTable('Conversations');
        if (!$mss->hasColumn('cnvNotificationOverridesEnabled')) {
            $mss->addColumn('cnvNotificationOverridesEnabled', 'boolean', array('unsigned' => true, 'notnull' => true, 'length' => 1, 'default' => 0));
        }
        if (!$mss->hasColumn('cnvSendNotification')) {
            $mss->addColumn('cnvSendNotification', 'boolean', array('unsigned' => true, 'notnull' => true, 'length' => 1, 'default' => 0));
        }
        if (!$mss->hasColumn('cnvNotificationEmailAddress')) {
            $mss->addColumn('cnvNotificationEmailAddress', 'text', array('notnull' => false));
        }
        $this->updatePermissionDurationObjects();

        $key = Key::getByHandle('add_conversation_message');
        if (is_object($key) && !$key->permissionKeyHasCustomClass()) {
            $key->setPermissionKeyHasCustomClass(true);
        }

        \Concrete\Core\Database\Schema\Schema::refreshCoreXMLSchema(array('ConversationPermissionAddMessageAccessList'));
    }

    protected function updatePermissionDurationObjects()
    {
        $db = \Database::get();
        $r = $db->Execute('select pdID from PermissionDurationObjects order by pdID asc');
        while ($row = $r->FetchRow()) {
            $pd = Duration::getByID($row['pdID']);
            if (isset($pd->error)) {
                // this is a legacy object. It was serialized from 5.7.3.1 and earlier and used to extend Object.
                // so we take the old pd* parameters and use them as the basis for the standard parameters.
                $pd->setStartDate($pd->pdStartDate);
                $pd->setEndDate($pd->pdEndDate);
                $pd->setStartDateAllDay((bool) $pd->pdStartDateAllDay);
                $pd->setEndDateAllDay((bool) $pd->pdEndDateAllDay);
                if ($pd->pdRepeatPeriod == 'daily') {
                    $pd->setRepeatPeriod(Duration::REPEAT_DAILY);
                } else if ($pd->pdRepeatPeriod == 'weekly') {
                    $pd->setRepeatPeriod(Duration::REPEAT_WEEKLY);
                } else if ($pd->pdRepeatPeriod == 'monthly') {
                    $pd->setRepeatPeriod(Duration::REPEAT_MONTHLY);
                } else {
                    $pd->setRepeatPeriod(Duration::REPEAT_NONE);
                }
                if ($pd->pdRepeatEveryNum) {
                    $pd->setRepeatEveryNum($pd->pdRepeatEveryNum);
                }
                if ($pd->pdRepeatPeriodWeeksDays) {
                    $pd->setRepeatPeriodWeekDays($pd->pdRepeatPeriodWeeksDays);
                }
                if ($pd->pdRepeatPeriodMonthsRepeatBy == 'week') {
                    $pd->setRepeatMonthBy(Duration::MONTHLY_REPEAT_WEEKLY);
                } else if ($pd->pdRepeatPeriodMonthsRepeatBy == 'month') {
                    $pd->setRepeatMonthBy(Duration::MONTHLY_REPEAT_MONTHLY);
                }
                if ($pd->pdRepeatPeriodEnd) {
                    $pd->setRepeatPeriodEnd($pd->pdRepeatPeriodEnd);
                }

                unset($pd->pdStartDate);
                unset($pd->pdEndDate);
                unset($pd->pdStartDateAllDay);
                unset($pd->pdEndDateAllDay);
                unset($pd->pdRepeatPeriod);
                unset($pd->pdRepeatEveryNum);
                unset($pd->pdRepeatPeriodWeeksDays);
                unset($pd->pdRepeatPeriodMonthsRepeatBy);
                unset($pd->pdRepeatPeriodEnd);
                unset($pd->error);
                $pd->save();
            }
        }
    }

    public function postUp(Schema $schema)
    {
        $db = \Database::get();
        if ($this->updateSectionPlurals) {
            $rs = $db->Execute('select cID, msLanguage, msCountry from MultilingualSections');
            while ($row = $rs->FetchRow()) {
                $locale = $row['msLanguage'];
                if ($row['msCountry']) {
                    $locale .= '_' . $row['msCountry'];
                }
                $localeInfo = \Gettext\Utils\Locales::getLocaleInfo($locale);
                if ($localeInfo) {
                    $db->update(
                        'MultilingualSections',
                        array(
                            'msNumPlurals' => $localeInfo['plurals'],
                            'msPluralRule' => $localeInfo['pluralRule'],
                        ),
                        array('cID' => $row['cID'])
                    );
                }
            }
        }
        if ($this->updateMultilingualTranslations) {
            $db->Execute("UPDATE MultilingualTranslations SET comments = REPLACE(comments, ':', '\\n') WHERE comments IS NOT NULL");
        }
    }

    public function down(Schema $schema)
    {
    }
}
