import { IconBrandTelegram } from '@tabler/icons-react'
import { Button } from '@mantine/core'

import classes from './subscription-link.module.css'

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
            href={supportUrl}
            leftSection={<IconBrandTelegram size={18} />}
            radius={0}
            rel="noopener noreferrer"
            target="_blank"
        >
            Перейти в бота
        </Button>
    )
}
