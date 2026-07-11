import {
    IconBrandDiscord,
    IconBrandTelegram,
    IconBrandVk,
    IconMessageChatbot
} from '@tabler/icons-react'
import { Button } from '@mantine/core'

import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import classes from './subscription-link.module.css'

interface IProps {
    supportUrl: string
}

const OPEN_BOT_LABELS: Record<string, string> = {
    en: 'Open bot',
    ru: 'Открыть бота',
    zh: '打开机器人',
    fa: 'باز کردن ربات',
    fr: 'Ouvrir le bot'
}

export const SubscriptionLinkWidget = ({ supportUrl }: IProps) => {
    const { currentLang } = useTranslation()

    if (supportUrl === '') return null

    const iconConfig = {
        't.me': IconBrandTelegram,
        'discord.com': IconBrandDiscord,
        'vk.com': IconBrandVk
    }

    const matchedPlatform = Object.entries(iconConfig).find(([domain]) =>
        supportUrl.includes(domain)
    )

    const Icon = matchedPlatform ? matchedPlatform[1] : IconMessageChatbot
    const label = OPEN_BOT_LABELS[currentLang] ?? OPEN_BOT_LABELS.en

    return (
        <Button
            className={classes.botButton}
            component="a"
            href={supportUrl}
            leftSection={<Icon size={20} />}
            ml="auto"
            onClick={() => vibrate('tap')}
            rel="noopener noreferrer"
            target="_blank"
            variant="filled"
        >
            {label}
        </Button>
    )
}
