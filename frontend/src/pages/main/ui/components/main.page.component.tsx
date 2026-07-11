import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'
import { IconArrowDown, IconCheck, IconClock } from '@tabler/icons-react'
import { Box, Container, Group, Image, Stack, Text, Title } from '@mantine/core'
import { useEffect } from 'react'

import {
    AccordionBlockRenderer,
    InstallationGuideConnector,
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
                                {brandName || 'a4vpn'}
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
                        <div className={classes.heroTopline}>
                            <span
                                className={isActive ? classes.statusActive : classes.statusInactive}
                            >
                                {isActive ? (
                                    <IconCheck size={14} stroke={3} />
                                ) : (
                                    <IconClock size={14} />
                                )}
                                {isActive ? 'Подписка активна' : 'Подписка неактивна'}
                            </span>
                        </div>

                        <div className={classes.heroContent}>
                            <div>
                                <Text className={classes.eyebrow}>ВАШ БЫСТРЫЙ ИНТЕРНЕТ</Text>
                                <Title className={classes.heroTitle} order={1}>
                                    Включил
                                    <br />И <span>забыл</span>
                                </Title>
                                <Text className={classes.heroDescription}>
                                    Одна подписка для всех устройств. Выберите приложение ниже —
                                    остальное настроится автоматически.
                                </Text>
                            </div>

                            <div className={classes.subscriptionMeta}>
                                <div className={classes.metaItem}>
                                    <span className={classes.metaLabel}>Работает до</span>
                                    <strong>{expiresAt}</strong>
                                </div>
                                <div className={classes.metaDivider} />
                                <div className={classes.metaItem}>
                                    <span className={classes.metaLabel}>Трафик</span>
                                    <strong>{traffic}</strong>
                                </div>
                            </div>
                        </div>

                        <a className={classes.scrollHint} href="#setup">
                            Настроить устройство <IconArrowDown size={16} />
                        </a>
                    </section>

                    {atLeastOnePlatformApp && (
                        <section className={classes.setup} id="setup">
                            <div className={classes.sectionHeading}>
                                <div>
                                    <Title order={2}>Подключите устройство</Title>
                                    <Text>
                                        Мы уже определили вашу систему. Выберите приложение и
                                        следуйте шагам.
                                    </Text>
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

                    <footer className={classes.footer}>
                        <span>{brandName || 'a4vpn'}</span>
                        <span>Интернет должен просто работать.</span>
                    </footer>
                </Stack>
            </Container>
        </Page>
    )
}
