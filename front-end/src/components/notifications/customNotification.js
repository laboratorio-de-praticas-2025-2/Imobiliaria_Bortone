import React from "react";

export default function CustomNotification({ toast, imovel, tipo, onViewNow, onClose }) {
    // 🔍 DEBUG: Vamos ver exatamente o que está chegando
    console.log('🔥 CustomNotification - Props recebidas:', { toast, imovel, tipo });
    console.log('🔥 CustomNotification - imovel completo:', JSON.stringify(imovel, null, 2));
    console.log('🔥 CustomNotification - imovel.property:', imovel?.property);

    // Extrair dados do imóvel - tentando várias formas
    const title = imovel?.title || "Imóvel em Destaque";
    const message = imovel?.message || "Confira este imóvel interessante!";

    // Tenta várias formas de acessar os dados da propriedade
    const property = imovel?.property || imovel?.imovel || imovel?.data || imovel;

    console.log('🔥 CustomNotification - property extraída:', property);
    console.log('🔥 CustomNotification - keys do property:', Object.keys(property || {}));

    // Formatação de dados com fallbacks mais robustos
    const preco = property?.preco || property?.valor || property?.price;
    const precoFormatado = preco ? `R$ ${parseFloat(preco).toLocaleString('pt-BR')}` : 'Consulte';

    const area = property?.area || property?.metragem || property?.size;
    const areaFormatada = area ? `${area}m²` : '';

    const endereco = property?.endereco || property?.address ||
        `${property?.cidade || ''} ${property?.bairro || ''}`.trim() ||
        'Endereço não informado';

    const tipoNegociacao = property?.tipo_negociacao || property?.tipo || property?.type || 'venda';
    const id = property?.id || property?.imovel_id;

    console.log('🔥 CustomNotification - Dados processados:', {
        precoFormatado, areaFormatada, endereco, tipoNegociacao, id
    });

    // Imagem placeholder ou URL real (você pode implementar lógica para buscar imagem)
    const imagemUrl = property?.imagem_url || '/images/placeholder-house.jpg';

    return (
        <div className="notification-container" style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important",
            borderRadius: "16px !important",
            padding: "4px !important",
            minWidth: "380px !important",
            maxWidth: "420px !important",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.08) !important",
            position: "relative !important",
            overflow: "hidden !important",
            border: "none !important"
        }}>
            {/* Container interno branco */}
            <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                position: "relative"
            }}>
                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "transparent",
                        border: "none",
                        fontSize: 18,
                        cursor: "pointer",
                        color: "#999",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = "#f5f5f5";
                        e.target.style.color = "#333";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#999";
                    }}
                >
                    ×
                </button>

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    paddingRight: 32
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12
                    }}>
                        <span style={{ color: "white", fontSize: 20 }}>🏠</span>
                    </div>
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#333"
                        }}>
                            {title}
                        </h3>
                        <span style={{
                            fontSize: 12,
                            color: "#667eea",
                            textTransform: "uppercase",
                            fontWeight: 500
                        }}>
                            {tipoNegociacao}
                        </span>
                    </div>
                </div>

                {/* Imagem do imóvel */}
                <div style={{
                    width: "100%",
                    height: 120,
                    borderRadius: 8,
                    backgroundImage: `url(${imagemUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "#f5f5f5",
                    marginBottom: 12,
                    position: "relative"
                }}>
                    {/* Overlay com preço */}
                    <div style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: "rgba(0,0,0,0.8)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 14,
                        fontWeight: 600
                    }}>
                        {precoFormatado}
                    </div>

                    {areaFormatada && (
                        <div style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(102, 126, 234, 0.9)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500
                        }}>
                            {areaFormatada}
                        </div>
                    )}
                </div>

                {/* Informações */}
                <div style={{ marginBottom: 16 }}>
                    <p style={{
                        margin: 0,
                        marginBottom: 8,
                        fontSize: 14,
                        color: "#666",
                        lineHeight: 1.4
                    }}>
                        {message}
                    </p>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#999",
                        fontSize: 13
                    }}>
                        <span style={{ marginRight: 4 }}>📍</span>
                        <span>{endereco}</span>
                    </div>
                </div>

                {/* Botões */}
                <div style={{
                    display: "flex",
                    gap: 8
                }}>
                    <button
                        onClick={() => onViewNow(id)}
                        style={{
                            flex: 1,
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "12px 16px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            textAlign: "center"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                        }}
                    >
                        Ver Imóvel
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            background: "#f8f9fa",
                            color: "#666",
                            border: "1px solid #e9ecef",
                            borderRadius: 8,
                            padding: "12px 16px",
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#e9ecef";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "#f8f9fa";
                        }}
                    >
                        Depois
                    </button>
                </div>
            </div>
        </div>
    );
}