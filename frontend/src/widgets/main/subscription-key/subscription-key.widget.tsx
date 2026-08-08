import { ActionIcon, Button, CopyButton, Group, Image, Stack, Text } from '@mantine/core'
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
            <span className={classes.label}>Добавить вручную</span>

            <Group className={classes.keyRow} gap={0} wrap="nowrap">
                <span className={classes.key}>{subscriptionUrl}</span>
                <CopyButton value={subscriptionUrl}>
                    {({ copied, copy }) => (
                        <ActionIcon
                            aria-label="Скопировать ключ"
                            className={classes.copyButton}
                            onClick={() => {
                                vibrate('drop')
                                copy()
                            }}
                            radius={0}
                        >
                            {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                        </ActionIcon>
                    )}
                </CopyButton>
            </Group>

            <Button
                className={classes.qrButton}
                leftSection={<IconQrcode size={18} />}
                onClick={handleShowQr}
                radius={0}
            >
                Показать QR-код
            </Button>
        </section>
    )
}
