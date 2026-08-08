import { IconBrandTelegram } from '@tabler/icons-react'
import { Button } from '@mantine/core'

import classes from './subscription-link.module.css'

const BOT_URL = 'https://t.me/a4securebot'

interface IProps {
    hideGetLink: boolean
    supportUrl: string
}

export const SubscriptionLinkWidget = ({ supportUrl }: IProps) => {
    if (supportUrl === '') return null

    return (
        <Button
            className={classes.botButton}
            component="a"
            href={BOT_URL}
            leftSection={<IconBrandTelegram size={16} />}
            radius={0}
            rel="noopener noreferrer"
            target="_blank"
        >
            В бота
        </Button>
    )
}
