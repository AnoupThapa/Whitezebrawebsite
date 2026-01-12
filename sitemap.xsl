<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>Sitemap - Whitezebra Consulting</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style type="text/css">
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
                        color: #1e293b;
                        line-height: 1.6;
                        padding: 2rem;
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #1a365d 0%, #2d6bc9 100%);
                        color: white;
                        padding: 3rem 2rem;
                        text-align: center;
                    }
                    
                    .header h1 {
                        font-size: 2.5rem;
                        margin-bottom: 0.5rem;
                        font-weight: 700;
                    }
                    
                    .header p {
                        font-size: 1.1rem;
                        opacity: 0.9;
                    }
                    
                    .stats {
                        display: flex;
                        justify-content: center;
                        gap: 2rem;
                        padding: 2rem;
                        background: #f8fafc;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    
                    .stat {
                        text-align: center;
                    }
                    
                    .stat-number {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #1a365d;
                    }
                    
                    .stat-label {
                        font-size: 0.9rem;
                        color: #64748b;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    thead {
                        background: #1a365d;
                        color: white;
                    }
                    
                    th {
                        padding: 1.2rem 1.5rem;
                        text-align: left;
                        font-weight: 600;
                        font-size: 0.9rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    tbody tr {
                        border-bottom: 1px solid #e5e7eb;
                        transition: all 0.3s ease;
                    }
                    
                    tbody tr:hover {
                        background: #f8fafc;
                        transform: translateX(5px);
                    }
                    
                    td {
                        padding: 1.2rem 1.5rem;
                        font-size: 0.95rem;
                    }
                    
                    .url-cell a {
                        color: #2d6bc9;
                        text-decoration: none;
                        font-weight: 500;
                        transition: color 0.3s ease;
                    }
                    
                    .url-cell a:hover {
                        color: #1a365d;
                        text-decoration: underline;
                    }
                    
                    .priority-high {
                        color: #16a34a;
                        font-weight: 600;
                    }
                    
                    .priority-medium {
                        color: #2d6bc9;
                        font-weight: 600;
                    }
                    
                    .priority-low {
                        color: #64748b;
                        font-weight: 600;
                    }
                    
                    .changefreq {
                        display: inline-block;
                        padding: 0.3rem 0.8rem;
                        background: #e5e7eb;
                        border-radius: 50px;
                        font-size: 0.85rem;
                        font-weight: 500;
                        color: #1e293b;
                    }
                    
                    .footer {
                        padding: 2rem;
                        text-align: center;
                        background: #f8fafc;
                        color: #64748b;
                        font-size: 0.9rem;
                    }
                    
                    .footer a {
                        color: #2d6bc9;
                        text-decoration: none;
                        font-weight: 600;
                    }
                    
                    @media (max-width: 768px) {
                        body {
                            padding: 1rem;
                        }
                        
                        .header h1 {
                            font-size: 1.8rem;
                        }
                        
                        .stats {
                            flex-direction: column;
                            gap: 1rem;
                        }
                        
                        table {
                            font-size: 0.85rem;
                        }
                        
                        th, td {
                            padding: 0.8rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>XML Sitemap</h1>
                        <p>Whitezebra Consulting - Site Structure</p>
                    </div>
                    
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                            <div class="stat-label">Total URLs</div>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Last Modified</th>
                                <th>Change Frequency</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <td class="url-cell">
                                        <a href="{sitemap:loc}">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </a>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:lastmod"/>
                                    </td>
                                    <td>
                                        <span class="changefreq">
                                            <xsl:value-of select="sitemap:changefreq"/>
                                        </span>
                                    </td>
                                    <td>
                                        <xsl:choose>
                                            <xsl:when test="sitemap:priority &gt;= 0.8">
                                                <span class="priority-high">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:when>
                                            <xsl:when test="sitemap:priority &gt;= 0.5">
                                                <span class="priority-medium">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <span class="priority-low">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        Sitemap for <a href="https://whitezebraconsulting.com">WhiteZebra Consulting</a>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
