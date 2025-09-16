WITH
    estatisticas_imoveis
    AS
    (
        SELECT
            SUM(
                CASE
                    WHEN i.tipo = 'Apartamento' THEN 1
                    ELSE 0
                END
            ) AS totalApartamentos,
            SUM(
                CASE
                    WHEN i.tipo = 'Casa' THEN 1
                    ELSE 0
                END
            ) AS totalCasas,
            SUM(
                CASE
                    WHEN i.tipo = 'Terreno' THEN 1
                    ELSE 0
                END
            ) AS totalTerrenos,
            SUM(
                CASE
                    WHEN i.tipo_negociacao = 'venda' THEN 1
                    ELSE 0
                END
            ) AS totalVenda,
            SUM(
                CASE
                    WHEN i.tipo_negociacao = 'aluguel' THEN 1
                    ELSE 0
                END
            ) AS totalLocacao,
            COUNT(1) as totalImoveis
        FROM
            imoveis i
        WHERE
            i.status = 'disponivel'
    ),
    estatisticas_usuarios
    AS
    (
        SELECT
            SUM(
                CASE
                    WHEN f.nivel = 0 THEN 1
                    ELSE 0
                END
            ) AS totalAdministradores,
            SUM(
                CASE
                    WHEN f.nivel = 1 THEN 1
                    ELSE 0
                END
            ) AS totalVisitantes,
            COUNT(1) as totalUsuarios
        FROM
            usuario f
    ),
    estatisticas_vendas
    AS
    (
        SELECT
            JSON_ARRAYAGG (venda) AS vendas
        FROM
            (
                SELECT
                JSON_OBJECT (
                        'tipoImovel',
                        i.tipo,
                        'quantidade',
                        COUNT(*),
                        'porcentagem',
                        ROUND(100 * COUNT(*) / total.totalVendidos, 2)
                    ) AS venda
            FROM
                imoveis i
                    CROSS JOIN (
                        SELECT
                    COUNT(*) AS totalVendidos
                FROM
                    imoveis
                WHERE
                            status = 'vendido'
                    AND data_update_status >= DATE_SUB (CURDATE (), INTERVAL 30 DAY)
                    ) total
            WHERE
                    i.status = 'vendido'
                AND i.data_update_status >= DATE_SUB (CURDATE (), INTERVAL 30 DAY)
            GROUP BY
                    i.tipo,
                    total.totalVendidos
            ) vendas_sub
    ),
    alugueis_por_mes
    AS
    (
        SELECT
            JSON_ARRAYAGG (aluguel) AS alugueis
        FROM
            (
                SELECT
                JSON_OBJECT (
                        'mes',
                        m.mes,
                        'tipoImovel',
                        t.tipo,
                        'total',
                        COALESCE(COUNT(i.id), 0)
                    ) AS aluguel
            FROM
                (
                        SELECT
                    DATE_FORMAT (
                                DATE_SUB (CURDATE (), INTERVAL seq MONTH),
                                '%Y-%m'
                            ) AS mes
                FROM
                    (
                                                                                                                                                                                                                                                                SELECT
                            0 AS seq
                    UNION ALL
                        SELECT
                            1
                    UNION ALL
                        SELECT
                            2
                    UNION ALL
                        SELECT
                            3
                    UNION ALL
                        SELECT
                            4
                    UNION ALL
                        SELECT
                            5
                    UNION ALL
                        SELECT
                            6
                    UNION ALL
                        SELECT
                            7
                    UNION ALL
                        SELECT
                            8
                    UNION ALL
                        SELECT
                            9
                    UNION ALL
                        SELECT
                            10
                    UNION ALL
                        SELECT
                            11
                            ) AS seqs
                    ) m
                    CROSS JOIN (
                                                            SELECT
                        'Apartamento' AS tipo
                UNION ALL
                    SELECT
                        'Casa'
                UNION ALL
                    SELECT
                        'Terreno'
                    ) t
                LEFT JOIN imoveis i ON i.tipo = t.tipo
                    AND i.status = 'locado'
                    AND DATE_FORMAT (i.data_update_status, '%Y-%m') = m.mes
            GROUP BY
                    m.mes,
                    t.tipo
            ) alugueis_sub
    )
SELECT
    JSON_OBJECT (
        'imoveis',
        (
            SELECT
        JSON_OBJECT (
                    'totalApartamentos',
                    totalApartamentos,
                    'totalCasas',
                    totalCasas,
                    'totalTerrenos',
                    totalTerrenos,
                    'totalVenda',
                    totalVenda,
                    'totalLocacao',
                    totalLocacao,
                    'totalImoveis',
                    totalImoveis
                )
    FROM
        estatisticas_imoveis
        ),
        'usuarios',
        (
            SELECT
        JSON_OBJECT (
                    'totalAdministradores',
                    totalAdministradores,
                    'totalVisitantes',
                    totalVisitantes,
                    'totalUsuarios',
                    totalUsuarios
                )
    FROM
        estatisticas_usuarios
        ),
        'vendas',
        (
            SELECT
        vendas
    FROM
        estatisticas_vendas
        ),
        'alugueis',
        (
            SELECT
        alugueis
    FROM
        alugueis_por_mes
        )
    ) AS resultado;