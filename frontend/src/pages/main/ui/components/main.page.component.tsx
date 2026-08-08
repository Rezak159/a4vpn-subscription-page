import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'
import { Box, Container, Group, Image, Stack, Text, Title } from '@mantine/core'
import { IconArrowDown } from '@tabler/icons-react'
import { useEffect } from 'react'
import dayjs from 'dayjs'

import {
    AccordionBlockRenderer,
    InstallationGuideConnector,
    SubscriptionKeyWidget,
    SubscriptionLinkWidget
} from '@widgets/main'
import { useAppConfig, useAppConfigStoreActions, useCurrentLang } from '@entities/app-config-store'
import { useSubscription } from '@entities/subscription-info-store'
import { formatDate } from '@shared/utils/config-parser'
import { Page } from '@shared/ui'

import classes from './main.page.module.css'

interface IMainPageComponentProps {
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

const pluralizeDays = (days: number) => {
    const lastDigit = days % 10
    const lastTwoDigits = days % 100

    if (lastDigit === 1 && lastTwoDigits !== 11) return 'день'
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) return 'дня'
    return 'дней'
}

// Вордмарк как на a4flow.com: строчными, цифры — красным акцентом
const renderWordmark = (name: string) =>
    [...name.toLowerCase()].map((char, i) =>
        /\d/.test(char) ? (
            <span className={classes.brandAccent} key={i}>
                {char}
            </span>
        ) : (
            char
        )
    )

export const MainPageComponent = ({ isMobile, platform }: IMainPageComponentProps) => {
    const config = useAppConfig()
    const currentLang = useCurrentLang()
    const { setLanguage } = useAppConfigStoreActions()
    const subscription = useSubscription()

    useEffect(() => {
        if (currentLang !== 'ru') setLanguage('ru')
    }, [currentLang, setLanguage])

    const brandName = config.brandingSettings.title
    const hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean> = {
        ios: Boolean(config.platforms.ios?.apps.length),
        android: Boolean(config.platforms.android?.apps.length),
        linux: Boolean(config.platforms.linux?.apps.length),
        macos: Boolean(config.platforms.macos?.apps.length),
        windows: Boolean(config.platforms.windows?.apps.length),
        androidTV: Boolean(config.platforms.androidTV?.apps.length),
        appleTV: Boolean(config.platforms.appleTV?.apps.length)
    }

    const atLeastOnePlatformApp = Object.values(hasPlatformApps).some((value) => value)

    const isActive = subscription.user.userStatus === 'ACTIVE'
    const expiresAt = formatDate(subscription.user.expiresAt, 'ru', config.baseTranslations)
    const isIndefinite = dayjs(subscription.user.expiresAt).year() === 2099
    // В заголовке год лишний — он и так почти всегда текущий
    const expiresAtShort = expiresAt.replace(/,\s*\d{4}$/, '')
    const daysLeft = dayjs(subscription.user.expiresAt).diff(dayjs(), 'day')
    const timeLeft = daysLeft < 1 ? 'Меньше суток' : `${daysLeft} ${pluralizeDays(daysLeft)}`
    const traffic =
        subscription.user.trafficLimit === '0'
            ? `${subscription.user.trafficUsed} / ∞`
            : `${subscription.user.trafficUsed} / ${subscription.user.trafficLimit}`

    return (
        <Page>
            <Box className={classes.header}>
                <Container maw={1200} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <Group className={classes.headerInner} justify="space-between">
                        <Group gap="sm" style={{ userSelect: 'none' }} wrap="nowrap">
                            <Image
                                alt="a4flow"
                                className={classes.logo}
                                fit="contain"
                                src="/assets/a4flow-logo.png"
                            />
                            <Title className={classes.brand} order={4}>
                                {renderWordmark(brandName || 'a4vpn')}
                            </Title>
                        </Group>

                        <SubscriptionLinkWidget
                            hideGetLink={config.baseSettings.hideGetLinkButton}
                            supportUrl={config.brandingSettings.supportUrl}
                        />
                    </Group>
                </Container>
            </Box>

            <Container
                className={classes.container}
                maw={1200}
                px={{ base: 'md', sm: 'lg', md: 'xl' }}
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Stack gap={0}>
                    <section className={classes.hero}>
                        <div aria-hidden="true" className={classes.heroAccent} />

                        <Title className={classes.heroTitle} order={1}>
                            {!isActive && <span>Подписка истекла</span>}
                            {isActive && isIndefinite && 'Подписка активна'}
                            {isActive && !isIndefinite && (
                                <>
                                    Активна до <span>{expiresAtShort}</span>
                                </>
                            )}
                        </Title>

                        <div className={classes.subscriptionMeta}>
                            {isActive && !isIndefinite && (
                                <>
                                    <div className={classes.metaItem}>
                                        <span className={classes.metaLabel}>Осталось</span>
                                        <strong>{timeLeft}</strong>
                                    </div>
                                    <div className={classes.metaDivider} />
                                </>
                            )}
                            <div className={classes.metaItem}>
                                <span className={classes.metaLabel}>Трафик</span>
                                <strong>{traffic}</strong>
                            </div>
                        </div>

                        <a className={classes.heroCta} href="#setup">
                            Настроить устройство <IconArrowDown size={18} />
                        </a>
                    </section>

                    {atLeastOnePlatformApp && (
                        <section className={classes.setup} id="setup">
                            <div className={classes.sectionHeading}>
                                <div>
                                    <Title order={2}>Подключите устройство</Title>
                                    <Text>Выберите ваше устройство и следуйте инструкции.</Text>
                                </div>
                            </div>
                            <InstallationGuideConnector
                                BlockRenderer={AccordionBlockRenderer}
                                hasPlatformApps={hasPlatformApps}
                                isMobile={isMobile}
                                platform={platform}
                            />
                        </section>
                    )}

                    <SubscriptionKeyWidget />
                </Stack>
            </Container>
        </Page>
    )
}
