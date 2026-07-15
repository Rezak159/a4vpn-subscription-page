import { IconBrandTelegram, IconCheck, IconCopy, IconQrcode } from '@tabler/icons-react'
import { ActionIcon, Button, CopyButton, Group, Image, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { useSubscription } from '@entities/subscription-info-store'
import { vibrate } from '@shared/utils/vibrate'

import classes from './subscription-link.module.css'

const BOT_URL = 'https://t.me/a4securebot'

interface IProps {
    hideGetLink: boolean
    supportUrl: string
}

export const SubscriptionLinkWidget = ({ supportUrl }: IProps) => {
    const subscription = useSubscription()
    const subscriptionUrl = subscription.subscriptionUrl

    if (supportUrl === '') return null

    const handleShowQr = () => {
        vibrate('tap')

        const qrCode = renderSVG(subscriptionUrl, {
            whiteColor: '#faf5eb',
            blackColor: '#16130f'
        })

        modals.open({
            centered: true,
            title: 'Ваш ключ',
            classNames: {
                content: classes.modalContent,
                header: classes.modalHeader,
                title: classes.modalTitle,
                close: classes.modalClose
            },
            children: (
                <Stack align="center" gap="lg">
                    <div className={classes.qrFrame}>
                        <Image
                            alt="QR-код подписки"
                            className={classes.qrImage}
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`}
                        />
                    </div>

                    <Text className={classes.qrCaption}>
                        Отсканируйте в приложении, чтобы импортировать подписку
                    </Text>

                    <Group className={classes.qrUrlRow} gap="xs" wrap="nowrap">
                        <span className={classes.qrUrl}>{subscriptionUrl}</span>
                        <CopyButton value={subscriptionUrl}>
                            {({ copied, copy }) => (
                                <ActionIcon
                                    className={classes.qrCopy}
                                    onClick={() => {
                                        vibrate('drop')
                                        copy()
                                    }}
                                    variant="transparent"
                                >
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </Group>
                </Stack>
            )
        })
    }

    return (
        <Group gap="xs" wrap="nowrap">
            <ActionIcon
                aria-label="Показать QR-код"
                className={classes.qrButton}
                onClick={handleShowQr}
                radius={0}
            >
                <IconQrcode size={20} />
            </ActionIcon>

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
        </Group>
    )
}
