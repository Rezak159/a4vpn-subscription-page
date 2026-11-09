import { Button, CopyButton, Group, Image, Stack, Text } from '@mantine/core'
import { IconCheck, IconCopy, IconQrcode } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { useSubscription } from '@entities/subscription-info-store'
import { vibrate } from '@shared/utils/vibrate'

import classes from './subscription-key.module.css'

export const SubscriptionKeyWidget = () => {
    const { subscriptionUrl } = useSubscription()

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
                </Stack>
            )
        })
    }

    return (
        <section className={classes.section}>
            <Text c="dark.8" className={classes.title} fw={800}>
                Добавление вручную
            </Text>

            <p className={classes.key}>{subscriptionUrl}</p>

            <Group className={classes.buttons} gap="xs" justify="center" wrap="wrap">
                <Button
                    className={classes.button}
                    leftSection={<IconQrcode size={20} />}
                    onClick={handleShowQr}
                    radius={0}
                    variant="outline"
                >
                    Показать QR-код
                </Button>

                <CopyButton value={subscriptionUrl}>
                    {({ copied, copy }) => (
                        <Button
                            className={classes.button}
                            leftSection={copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
                            onClick={() => {
                                vibrate('drop')
                                copy()
                            }}
                            radius={0}
                            variant="outline"
                        >
                            {copied ? 'Скопировано' : 'Скопировать ключ'}
                        </Button>
                    )}
                </CopyButton>
            </Group>
        </section>
    )
}
